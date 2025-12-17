# Angular Version Initial Flow (verizon-vla-ba1lite)

## Overview
The Angular version uses a different API pattern compared to the React version. While React uses `/LoadState` and `/RetainState`, Angular uses `/GetMyVotes` (LoadState equivalent) and `/VoteManyQuestionsFromJson` (RetainState equivalent).

## Bootstrap Flow

### 1. Application Entry Point
- **File**: `src/main.ts`
- Bootstraps `AppModule` using Angular's platform browser dynamic

### 2. BootstrapService Initialization
- **File**: `src/app/shared/bootstrap.service.ts`
- **Key Methods**:
  - `initAppConfig()`: Sets up configuration, storage mode, SignalR, XAPI tracking
  - `init()`: Main initialization sequence

### 3. Initialization Sequence

```
AppComponent.ngOnInit()
  └─> bootstrapService.initAppConfig()
      └─> Sets up:
          - Logger configuration
          - ManifestService configuration
          - HTTP hostname
          - SignalR configuration
          - XAPI tracking setup
          - Storage mode (MIXED or LOCAL based on connectToPulse)
      
  └─> Subscribes to APP_READY event
      └─> When appReady = true:
          └─> initializeContent()

SplashComponent.ngOnInit()
  └─> bootstrapService.init()
      └─> modelLoader.getModel()
          └─> textService.init() (loads language content)
          └─> calcService.getApi(model) (loads calc model)
          └─> Promise.all([textService, calcService])
              └─> If connectToPulse:
                  └─> syncService.initializeSync()
                      └─> syncService.setMode(PUSH)
                          └─> Sets appReady = true
```

### 4. SyncService.initializeSync() Flow

**File**: `public/btsdigital-ngx-isomer-core.js` (lines 4261-4296)

```javascript
initializeSync() {
  return this.calcService.getApi()
    .then(() => {
      // Get state from manifest
      this.state = this.manifestService.Get();
      
      // Subscribe to state changes
      this.manifestService.State.subscribe((newState) => {
        this.state = newState;
      });
      
      // Subscribe to errors
      this.connectThrottler.ErrorEmitter.subscribe(...);
      
      // Set if user is foreman
      return this.setIsUserForeman();
    })
    .then(() => {
      // Set up polling:
      // - Upload: triggered on MODEL_CALC_COMPLETE (debounced)
      // - Download: interval-based polling
      const debouncetime = this.communicator
        .getEmitter(Constants.MODEL_CALC_COMPLETE)
        .pipe(debounceTime(POLLING_UPLOAD_THROTTLE));
      
      this.subscription = debouncetime.subscribe(this.Upload);
      this.dlSubscription = interval(POLLING_DOWNLOAD_INTERVAL)
        .subscribe(this.Download);
    })
    .then(() => {
      // Initial download after connection setup
      return this.connectThrottler.Init(this.state)
        .then(this.Download);
    });
}
```

### 5. ConnectThrottlerService.Init()

**File**: `public/btsdigital-ngx-isomer-core.js` (lines 3477-3493)

```javascript
Init(state) {
  // Get question IDs from backend
  this.activeRequest = this.connect.getQuestionIds(state)
    .then((statenew) => {
      // Maps question names to question IDs
      this.isInitialized = true;
      this.activeRequest = null;
      return statenew;
    });
}
```

### 6. Download Flow (LoadState Equivalent)

**ConnectThrottlerService.QueueDownload()** (lines 3362-3376):
```javascript
QueueDownload(state) {
  if (!this.isInitialized) {
    return this.Init(state).then(this.QueueDownload);
  }
  
  this.syncStatusService.SetDownloadStatus(SyncStatus.Syncing);
  
  return this.connect.getMyVotes(state)  // Calls /GetMyVotes
    .then((statenew) => {
      return this.connect.getMyForemanVotes(statenew)
        .then((statenewest) => {
          this.syncStatusService.SetDownloadStatus(SyncStatus.InSync);
          return statenewest;
        });
    });
}
```

**ConnectService.getMyVotes()** (lines 2674-2739):
- Maps to endpoint: `/Wizer/CloudFront/GetMyVotes` (Pulse) or `/user/getmyvotes` (Momenta)
- Returns votes object: `{ QuestionId: ResponseText }`
- Used by `JsCalcConnectorService.writeValues()` to restore values to CalcService

### 7. Upload Flow (RetainState Equivalent)

**ConnectThrottlerService.QueueUpload()** (lines 3316-3357):
```javascript
QueueUpload(state) {
  // Check if initialized, queue if active request exists
  
  this.syncStatusService.SetStatus(SyncStatus.Syncing);
  const stateCopy = this.clone(state);
  const currentQuestionsToSend = stateCopy.config.questionsToSend;
  
  // Change detection: Only send changed values
  if (this.lastSuccessfulSync) {
    const diff = stateCopy.config.questionsToSend.filter((question, idx) => {
      return question.responseText !== 
             this.lastSuccessfulSync.config.questionsToSend[idx].responseText;
    });
    stateCopy.config.questionsToSend = diff;
  }
  
  this.activeRequest = this.connect.voteManyQuestionsFromJson(stateCopy)
    .then((statenew) => {
      this.syncStatusService.SetStatus(SyncStatus.InSync);
      this.lastSuccessfulSync = mergedManifest;
      this.activeRequest = null;
    });
}
```

**ConnectService.voteManyQuestionsFromJson()** (lines 2612-2669):
- Maps to endpoint: `/Wizer/CloudFront/VoteManyQuestionsFromJson` (Pulse) or `/user/votemanyquestionsfromjson` (Momenta)
- Sends payload: `{ votesJson: JSON.stringify({ votes: [...], voteFromIsomer: true }) }`

**JsCalcConnectorService.readValues()** (lines 3633-3656):
- Reads values from CalcService using `calcService.getValue(question.rangeName, question.rawValue)`
- Populates `state.config.questionsToSend[].responseText`

### 8. Value Restoration Priority

**JsCalcConnectorService.writeValues()** (lines 3660-3808):
1. Restores `questionsToReceive` values from `state.votes` to CalcService
2. Only writes values that actually changed (compares with existing CalcService value)
3. Then restores foreman votes if applicable

**Key Difference from React Version**:
- Angular: Uses `questionIds` mapping (ShortName → Id) and sends/receives votes as `{ QuestionId, ResponseText }`
- React: Uses question names directly (`return_url`, `model_state`, `tlInputTeamName`, etc.)

## Key Differences: Angular vs React

| Aspect | Angular Version | React Version |
|--------|----------------|---------------|
| **Load State API** | `/GetMyVotes` | `/LoadState` |
| **Save State API** | `/VoteManyQuestionsFromJson` | `/RetainState` |
| **Question Mapping** | ShortName → QuestionId → Backend | QuestionName → Backend directly |
| **Change Detection** | Compares `responseText` in `lastSuccessfulSync` | Compares `currentValues` vs `lastSavedValues` |
| **Initial Load** | `connectThrottler.Init()` → `Download()` | `loadStateFromBackend()` |
| **Model State** | Not explicitly tracked separately | `model_state` as separate JSON string |
| **tlInput Values** | Part of `questionsToReceive` array | Separate top-level keys in `appStorage` |

## Flow Summary

### On App Start (Refresh):
1. **BootstrapService.initAppConfig()** → Configure services
2. **BootstrapService.init()** → Load model + text
3. **SyncService.initializeSync()** → Set up sync infrastructure
4. **ConnectThrottlerService.Init()** → Get question IDs from backend
5. **ConnectThrottlerService.QueueDownload()** → Call `getMyVotes()` (LoadState)
6. **JsCalcConnectorService.writeValues()** → Restore values to CalcService
7. **Model calculates** → Triggers `MODEL_CALC_COMPLETE`
8. **ConnectThrottlerService.QueueUpload()** → Call `voteManyQuestionsFromJson()` (RetainState) with **changed values only**

### Change Detection in Angular:
- Maintains `lastSuccessfulSync` with full `questionsToSend` array
- On upload, compares `question.responseText` with `lastSuccessfulSync`
- Only sends questions where `responseText` changed
- **First upload after init**: Sends all questions (no `lastSuccessfulSync`)

### React Version Pattern:
- Maintains `lastSavedValues` as flat object: `{ questionName: value }`
- On save, compares current values from CalcService with `lastSavedValues`
- Only sends questions where value changed
- **First save after load**: Sends all questions that differ from loaded values

