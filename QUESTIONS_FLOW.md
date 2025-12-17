# QuestionsToSend vs QuestionsToReceive Flow

## Overview

**YES - This flow is EXACTLY the same in the Angular app!**

The Angular app uses the same pattern:
- **`questionsToSend`**: Controls what questions are **READ from CalcService** and **SENT/SAVED** to the backend
- **`questionsToReceive`**: Controls what questions are **RESTORED/WRITTEN** to CalcService from backend data

### Angular Implementation (from `btsdigital-ngx-isomer-core.js`):

**`readValues()`** (line 3633):
```javascript
for (const i of Object.keys(state.config.questionsToSend)) {
    const q = state.config.questionsToSend[i];
    q.responseText = this.jsCalcApi.getValue(q.rangeName, q.rawValue);
    // Reads values from CalcService for all questions in questionsToSend
}
```

**`writeValues()`** (line 3660):
```javascript
for (const i of Object.keys(state.config.questionsToReceive)) {
    question = state.config.questionsToReceive[i];
    question.responseText = state.votes[question.questionId];
    // Writes values to CalcService for all questions in questionsToReceive
    this.jsCalcApi.setValue(question.rangeName, question.responseText);
}
```

**Flow**: `QueueDownload()` → `writeValues(questionsToReceive)` → `QueueUpload()` → `readValues(questionsToSend)`

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PAGE LOAD / REFRESH                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   loadStateFromBackend()            │
        │   Uses: questionsToSend             │
        │                                     │
        │   Backend API: /LoadState           │
        │   Request: ["return_url",           │
        │             "model_state",          │
        │             "tlInputTeamName", ...] │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   Backend Response                  │
        │   Returns: {                        │
        │     return_url: "dashboard",        │
        │     model_state: "{...}",           │
        │     tlInputTeamName: "Mahir",       │
        │     tlInputTeamNumber: "123",       │
        │     ...                             │
        │   }                                 │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   Store in appStorage (localStorage)│
        │   ALL questions from backend        │
        │   (filtered by questionsToSend)    │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   loadModelState()                  │
        │   Uses: questionsToReceive          │
        │                                     │
        │   Filter appStorage:                │
        │   - model_state ✅                  │
        │   - tlInputTeamNumber ✅ (only if   │
        │     in questionsToReceive)          │
        │   - tlInputTeamName ❌ (not in     │
        │     questionsToReceive)             │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   writeValuesToCalc()               │
        │   Uses: questionsToReceive          │
        │                                     │
        │   1. Restore model_state first      │
        │   2. Then restore tlInput values    │
        │      that are in questionsToReceive │
        │                                     │
        │   Only writes values that are:      │
        │   - In questionsToReceive           │
        │   - Present in appStorage           │
        │   - Not error values (#N/A, etc.)   │
        └─────────────────────────────────────┘
                              │
                              ▼
                    CalcService Updated
                    (Only questionsToReceive)


┌─────────────────────────────────────────────────────────────────┐
│                    USER MAKES CHANGES                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   MODEL_CALC_COMPLETE event         │
        │   (debounced 500ms)                 │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   saveStateToBackend()             │
        │   Uses: questionsToSend            │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   StateThrottler.queueUpload()     │
        │   Uses: questionsToSend            │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   readValuesFromCalc()             │
        │   Uses: questionsToSend            │
        │                                     │
        │   Reads from CalcService:           │
        │   - return_url                      │
        │   - model_state (getModelState())   │
        │   - All tlInput in questionsToSend │
        │     via getValue()                  │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   Change Detection                  │
        │   Compare with lastSavedValues      │
        │   Only send if changed              │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   Backend API: /RetainState         │
        │   Request: {                        │
        │     return_url: "dashboard",        │
        │     model_state: "{...}",           │
        │     tlInputTeamName: "Mahir",       │
        │     ... (all in questionsToSend)   │
        │   }                                 │
        └─────────────────────────────────────┘
```

## Key Points

### 1. **LoadState Flow** (Loading from Backend)
```
Backend → LoadState API (questionsToSend) → appStorage → CalcService (questionsToReceive)
```

- `loadStateFromBackend()` uses **`questionsToSend`** to tell backend which questions to return
- Backend returns ALL questions in `questionsToSend`
- ALL returned questions are stored in `appStorage`
- `loadModelState()` uses **`questionsToReceive`** to filter which questions to restore to CalcService
- Only questions in `questionsToReceive` are written to CalcService via `writeValuesToCalc()`

### 2. **RetainState Flow** (Saving to Backend)
```
CalcService → readValuesFromCalc (questionsToSend) → Change Detection → RetainState API
```

- `saveStateToBackend()` uses **`questionsToSend`** throughout
- `readValuesFromCalc()` reads values from CalcService for all questions in `questionsToSend`
- Only changed values (compared to `lastSavedValues`) are sent to backend
- All questions in `questionsToSend` are included in the save request

### 3. **Your Current Config**

**`questionToSend`** (87 questions):
- `return_url`, `model_state`, `tlInputTeamName`, `tlInputPlanning1`, ... (all tlInput questions)
- Used for: Loading from backend, Saving to backend

**`questionsToReceive`** (1 question):
- `tlInputTeamNumber`
- Used for: Restoring to CalcService

## Example Scenario

### Initial Load:
1. Backend has: `tlInputTeamName = "Mahir"`, `tlInputTeamNumber = "123"`
2. `LoadState` requests all questions in `questionToSend` → backend returns both
3. Both stored in `appStorage`
4. `loadModelState()` checks `questionsToReceive` → only `tlInputTeamNumber` is in the list
5. Only `tlInputTeamNumber = "123"` is restored to CalcService
6. `tlInputTeamName = "Mahir"` stays in `appStorage` but NOT in CalcService

### User Changes:
1. User changes `tlInputTeamName` in UI → CalcService updates
2. `RetainState` reads all questions in `questionToSend` (including `tlInputTeamName`)
3. `tlInputTeamName` change is detected and sent to backend
4. Backend saves the updated `tlInputTeamName`

## Use Cases

**Scenario 1: Backend-only tracking**
- Question in `questionToSend` but NOT in `questionsToReceive`
- Example: `tlInputTeamName`
- ✅ Saved to backend on changes
- ✅ Loaded from backend to `appStorage`
- ❌ NOT restored to CalcService
- Use case: Track values backend-only, don't affect calculations

**Scenario 2: Full sync**
- Question in BOTH `questionToSend` and `questionsToReceive`
- Example: `tlInputTeamNumber` (if added to `questionToSend`)
- ✅ Saved to backend on changes
- ✅ Loaded from backend to `appStorage`
- ✅ Restored to CalcService
- Use case: Full two-way sync with backend

**Scenario 3: CalcService-only**
- Question NOT in `questionToSend` but manually handled
- Not tracked by backend sync
- Use case: Local-only calculations

