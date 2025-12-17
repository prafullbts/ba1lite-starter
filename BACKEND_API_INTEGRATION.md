# Backend API Integration Guide

This document explains how the CMM BA1 Lite application integrates with backend APIs for state management.

## Overview

The backend integration consists of three main components working together:
- **LoadState**: Load values on app refresh, apply modelState, apply individual question values
- **RetainState**: Save state on changes (debounced to avoid excessive calls)

## Architecture

### Component Overview

The backend integration uses a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    ModelStorageContext.tsx                    │
│  (Orchestration Layer - React Context Provider)              │
│  - Manages lifecycle (load on init, save on changes)         │
│  - Handles debouncing (500ms)                                │
│  - Listens to MODEL_CALC_COMPLETE events                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼────────┐        ┌────────▼──────────┐
│  stateService  │        │  calcConnector     │
│     .ts        │        │      .ts           │
│                │        │                    │
│ - saveState()  │        │ - readValues()     │
│ - loadState()  │        │ - writeValues()    │
│ - API client   │        │ - CalcService I/O  │
└───────┬────────┘        └────────┬───────────┘
        │                         │
        └─────────────┬───────────┘
                      │
            ┌─────────▼─────────┐
            │   config.ts        │
            │                    │
            │ - API base URL     │
            │ - questionToSend   │
            └────────────────────┘
```

### Component Responsibilities

#### 1. **stateService.ts** - API Communication Layer
- **Purpose**: Low-level HTTP API calls
- **Responsibilities**:
  - Initialize axios client with config
  - Make POST requests to `/RetainState` and `/LoadState`
  - Handle authentication (cookies via `withCredentials`)
  - Error handling and logging

**Key Functions:**
- `saveState(flattenedData)` - Saves state to backend via `/RetainState`
- `loadState(questions)` - Loads state from backend via `/LoadState`
- `checkBackendAvailability()` - Lightweight health check

#### 2. **calcConnector.ts** - CalcService Abstraction Layer
- **Purpose**: Clean interface between CalcService and state management
- **Responsibilities**:
  - Read values from CalcService (for saving)
  - Write values to CalcService (for restoration)
  - Handle model_state serialization/deserialization
  - Filter error values (#N/A, #REF!, etc.)

**Key Functions:**
- `readValuesFromCalc()` - Reads current values from CalcService
- `writeValuesToCalc()` - Writes values to CalcService (restores state)

#### 3. **ModelStorageContext.tsx** - Orchestration Layer
- **Purpose**: React Context Provider that manages the complete state lifecycle
- **Responsibilities**:
  - Load state from backend on app initialization
  - Save state to backend on CalcModel changes (debounced)
  - Manage localStorage synchronization
  - Handle initial value synchronization after recalculation

**Key Components:**
- `ModelStorageProvider` - Context provider wrapper
- `ModelStateManager` - Internal component that handles all state operations

#### 4. **stateThrottler.ts** - (Currently Unused)
- **Purpose**: Queue-based throttling with change detection
- **Status**: ⚠️ **File exists but is NOT currently used**
- **Note**: The current implementation uses simple debouncing in `ModelStorageContext` instead of the queueing/throttling pattern

### Configuration System

The app uses a runtime configuration system that loads API settings from `public/config.json`:

```json
{
  "apiBaseUrl": "https://isomerstage.btspulse.com/Wizer/Cloudfront",
  "questionToSend": ["model_state", "tlInputTeamRound", "tlInputProduct", ...]
}
```

**Key Features:**
- ✅ **Runtime Updates**: Change API endpoints without rebuilding
- ✅ **Caching**: Config is cached after first load for performance
- ✅ **Fallback**: Defaults to staging URL if config fails to load
- ✅ **Type Safety**: Full TypeScript support

**Configuration Management (`src/utils/config.ts`):**
- `loadConfig()` - Loads and caches config from `/config.json`
- `getApiBaseUrl()` - Returns API base URL
- `getQuestionToSend()` - Returns array of questions to sync with backend

### API Client Architecture

The application uses axios client (`stateService.ts`):
- ✅ **Auto-initialize** with config on first use
- ✅ **Include credentials** for cookie-based authentication
- ✅ **Handle errors gracefully** with proper logging
- ✅ **Support CORS** with credentials

## API Endpoints

### State Management Endpoints

| Endpoint | Method | Purpose | Request Body |
|----------|--------|---------|--------------|
| `/RetainState` | POST | Save application state | `{ jsonString: string }` |
| `/LoadState` | POST | Load application state | `{ questions: string[] }` |

## Complete Data Flow

### Flow 1: Application Initialization (Load State)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. App Starts                                                │
│    ModelStorageProvider mounts                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 2. loadModelDataFromBackend()                                │
│    - Calls stateService.loadState(questionsToSend)           │
│    - Receives: { model_state, tlInput1, tlInput2, ... }      │
│    - Stores in localStorage (appStorage)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 3. ModelStateManager (after CalcService initializes)         │
│    - Reads appStorage from localStorage                       │
│    - Prepares valuesToWrite object                           │
│    - Calls calcConnector.writeValuesToCalc()                 │
│      → Restores model_state to CalcService                   │
│      → Restores individual tlInput values (overrides)        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 4. CalcService Recalculates                                  │
│    - Triggers MODEL_CALC_COMPLETE event                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 5. syncInitialValues() (after recalculation)                │
│    - Reads ALL current values from CalcService                │
│    - Includes calculated/default values                      │
│    - Calls stateService.saveState()                          │
│    - Ensures backend has complete initial state             │
└─────────────────────────────────────────────────────────────┘
```

### Flow 2: State Changes (Save State)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Interaction or CalcModel Change                      │
│    - User modifies input, CalcModel updates                  │
│    - CalcService recalculates                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 2. MODEL_CALC_COMPLETE Event Fires                           │
│    - ModelStateManager listens to event                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 3. Debounced Save (500ms delay)                              │
│    - debouncedSave() function triggers                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 4. saveStateToBackend()                                       │
│    - Gets current modelState from CalcService                │
│    - Calls calcConnector.readValuesFromCalc()                │
│      → Reads model_state                                     │
│      → Reads all tlInput values from CalcService             │
│    - Updates localStorage (appStorage)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 5. stateService.saveState()                                  │
│    - Stringifies values object                               │
│    - POST /RetainState { jsonString: "..." }                │
│    - Backend stores state                                    │
└─────────────────────────────────────────────────────────────┘
```

### Code Structure

```
src/
├── services/
│   ├── stateService.ts        ✅ API calls (LoadState, RetainState)
│   ├── calcConnector.ts       ✅ Read/write abstraction for CalcService
│   └── stateThrottler.ts      ⚠️  Queue-based throttler (NOT USED)
│
├── contexts/
│   └── ModelStorageContext.tsx ✅ Main orchestration layer
│       ├── ModelStorageProvider
│       ├── ModelStateManager
│       ├── loadModelDataFromBackend()
│       └── saveStateToBackend()
│
└── utils/
    └── config.ts              ✅ Configuration management
```

### Implementation Details

#### 1. Configuration Loading (`src/utils/config.ts`)

```typescript
// Loads config from /config.json with caching
export const loadConfig = async (): Promise<AppConfig> => {
  if (cachedConfig) return cachedConfig;
  
  try {
    const response = await fetch('/config.json');
    const config = await response.json();
    cachedConfig = config;
    return config;
  } catch (error) {
    // Fallback to default staging URL
    return defaultConfig;
  }
};

// Helper functions
export const getApiBaseUrl = async (): Promise<string> => {
  const config = await loadConfig();
  return config.apiBaseUrl;
};

export const getQuestionToSend = async (): Promise<string[]> => {
  const config = await loadConfig();
  return config.questionToSend || ['model_state'];
};
```

#### 2. State Service (`src/services/stateService.ts`)

```typescript
// Low-level API communication
const apiClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Cookie-based auth
});

// Initialize with config (lazy initialization)
const initializeApiClient = async () => {
  if (!isInitialized) {
    const baseURL = await getApiBaseUrl();
    apiClient.defaults.baseURL = baseURL;
    isInitialized = true;
  }
};

// Save state to backend
export const saveState = async (flattenedData: Record<string, string>) => {
  await initializeApiClient();
  const jsonString = JSON.stringify(flattenedData);
  return apiClient.post('/RetainState', { jsonString });
};

// Load state from backend
export const loadState = async (questions: string[]) => {
  await initializeApiClient();
  return apiClient.post('/LoadState', { questions });
};
```

#### 3. Calc Connector (`src/services/calcConnector.ts`)

```typescript
// Read values from CalcService for saving
export async function readValuesFromCalc(
  calcService: any,
  questionsToSend: string[],
  appStorage: Record<string, any>,
  modelState?: string
): Promise<Record<string, string>> {
  const currentValues: Record<string, string> = {};
  
  // Get model_state
  currentValues.model_state = modelState || appStorage.model_state || '{}';
  
  // Read tlInput values directly from CalcService
  const tlInputQuestions = questionsToSend.filter(q => q.startsWith('tlInput'));
  for (const question of tlInputQuestions) {
    const rawValue = calcService.getValue(question, true);
    if (rawValue && !isErrorValue(rawValue)) {
      currentValues[question] = String(rawValue);
    }
  }
  
  return currentValues;
}

// Write values to CalcService (restore state)
export async function writeValuesToCalc(
  calcService: any,
  values: Record<string, string>,
  questionToSend: string[]
): Promise<void> {
  // Restore model_state first
  if (values.model_state) {
    const parsedState = JSON.parse(values.model_state);
    for (const [key, value] of Object.entries(parsedState)) {
      await calcService.setValue(key, value, true);
    }
  }
  
  // Restore individual tlInput values (override model_state)
  const tlInputQuestions = questionToSend.filter(q => q.startsWith('tlInput'));
  for (const question of tlInputQuestions) {
    if (values[question] && !isErrorValue(values[question])) {
      await calcService.setValue(question, values[question], true);
    }
  }
}
```

#### 4. Model Storage Context (`src/contexts/ModelStorageContext.tsx`)

```typescript
// Main orchestration component
function ModelStateManager() {
  const { calcService, isInitialized } = useCalc();
  
  // Load state on initialization
  useEffect(() => {
    if (!calcService || !isInitialized) return;
    
    // 1. Load from backend → localStorage
    const appStorage = loadAppStorage();
    
    // 2. Write to CalcService
    await writeValuesToCalc(calcService, valuesToWrite, questionToSend);
    
    // 3. After recalculation, sync all initial values
    communicator.on('MODEL_CALC_COMPLETE', () => {
      syncInitialValues(); // Save all current values to backend
    });
  }, [calcService, isInitialized]);
  
  // Save state on changes (debounced)
  useEffect(() => {
    const debouncedSave = debounce(() => {
      const modelState = calcService.getModelState();
      await saveStateToBackend(modelState, calcService);
    }, 500);
    
    communicator.on('MODEL_CALC_COMPLETE', debouncedSave);
    return () => communicator.off('MODEL_CALC_COMPLETE', debouncedSave);
  }, [calcService, isInitialized]);
}
```

## Key Design Decisions

### ✅ What We Use

1. **Debounced Saves (500ms)** - Prevents excessive API calls during rapid changes
2. **CalcConnector Abstraction** - Clean separation between CalcService and state management
3. **Simple API Wrapper** - Direct axios calls, easy to understand and debug
4. **localStorage Synchronization** - appStorage acts as intermediate cache
5. **Event-Driven Architecture** - MODEL_CALC_COMPLETE events trigger saves

### ⚠️ What We Don't Use (But Exists)

1. **StateThrottler** - File exists but is NOT used in current implementation
   - **Why**: Simple debouncing in ModelStorageContext is sufficient
   - **Alternative**: If you need queueing/guaranteed order, you could use StateThrottler
   - **Status**: Can be removed or kept for future use

### Benefits of Current Approach

1. **Simplicity**: Clear linear flow, easy to understand
2. **Efficiency**: Debouncing prevents excessive API calls
3. **Reliability**: localStorage acts as backup if backend fails
4. **Maintainability**: Fewer moving parts, easier to debug
5. **Separation of Concerns**: Each layer has a clear responsibility

## How Components Work Together

### Complete Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ModelStorageContext.tsx                       │
│  (Orchestrator - React Context Provider)                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. On App Init:                                          │  │
│  │    loadModelDataFromBackend()                            │  │
│  │    └─→ stateService.loadState()                         │  │
│  │        └─→ config.ts.getQuestionToSend()                │  │
│  │    └─→ Stores in localStorage                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 2. After CalcService Ready:                              │  │
│  │    writeValuesToCalc()                                    │  │
│  │    └─→ calcConnector.writeValuesToCalc()                 │  │
│  │        └─→ Restores model_state + tlInput values         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 3. On MODEL_CALC_COMPLETE (debounced 500ms):             │  │
│  │    saveStateToBackend()                                   │  │
│  │    └─→ calcConnector.readValuesFromCalc()                │  │
│  │        └─→ Reads model_state + tlInput values            │  │
│  │    └─→ stateService.saveState()                          │  │
│  │        └─→ POST /RetainState                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Dependencies

```
ModelStorageContext
  ├─→ stateService (API calls)
  │     └─→ config.ts (API URL, questions)
  ├─→ calcConnector (CalcService I/O)
  │     └─→ config.ts (questions list)
  └─→ localStorage (appStorage cache)
```

## Usage Examples

### Direct API Usage (Low-Level)

```typescript
import { saveState, loadState } from '@/services/stateService';

// Save application state
const appData = { 
  model_state: '{"key": "value"}', 
  tlInputTeamRound: '1',
  tlInputProduct: 'value'
};
await saveState(appData);

// Load specific questions
const questions = ['model_state', 'tlInputTeamRound', 'tlInputProduct'];
const loadedData = await loadState(questions);
```

### Using CalcConnector

```typescript
import { readValuesFromCalc, writeValuesToCalc } from '@/services/calcConnector';

// Read current values from CalcService
const currentValues = await readValuesFromCalc(
  calcService,
  questionsToSend,
  appStorage,
  modelState
);

// Write values to CalcService (restore state)
await writeValuesToCalc(
  calcService,
  backendValues,
  questionsToSend
);
```

### Configuration Management

```typescript
import { getApiBaseUrl, getQuestionToSend, resetConfigCache } from '@/utils/config';

// Get current API base URL
const baseUrl = await getApiBaseUrl();

// Get questions to sync
const questions = await getQuestionToSend();

// Force reload config (useful for testing)
resetConfigCache();
```

### Using ModelStorageProvider (Recommended)

```typescript
// In your App.tsx - already set up!
import { ModelStorageProvider } from '@/contexts/ModelStorageContext';

<CalcProvider>
  <ModelStorageProvider>
    {/* Your app components */}
  </ModelStorageProvider>
</CalcProvider>
```

The ModelStorageProvider automatically handles:
- ✅ Loading state on app initialization
- ✅ Saving state on changes (debounced)
- ✅ localStorage synchronization
- ✅ Error recovery

## Error Handling

The implementation includes comprehensive error handling:

### Network Errors
- ✅ **Graceful degradation**: App continues working if backend is unavailable
- ✅ **User feedback**: Console logging for debugging
- ✅ **Fallback behavior**: Local operations continue even if API fails
- ✅ **localStorage backup**: State persists locally even if backend fails

### Configuration Errors
- ✅ **Default fallback**: Uses staging URL if config.json fails to load
- ✅ **Caching**: Prevents repeated failed config loads
- ✅ **Error logging**: Clear error messages for debugging

### CalcService Errors
- ✅ **Error value filtering**: Skips #N/A, #REF!, etc.
- ✅ **Safe value conversion**: Handles null/undefined gracefully
- ✅ **Question validation**: Skips non-existent questions

## Development Workflow

### 1. Local Development
1. Update `public/config.json` with your local API URL
2. Refresh browser to load new config
3. Test API integration via browser console logs

### 2. Testing Different Environments
```typescript
// Force reload config for testing
import { resetConfigCache } from '@/utils/config';
resetConfigCache();
```

### 3. Production Deployment
1. Update `public/config.json` with production API URL
2. Deploy to web server
3. Config loads automatically on app startup

## Troubleshooting

### Common Issues

1. **Config not loading**: 
   - Check that `public/config.json` exists and is valid JSON
   - Check browser console for fetch errors
   - Verify file is accessible at `/config.json`

2. **CORS errors**: 
   - Ensure backend supports credentials and proper CORS headers
   - Check `withCredentials: true` in stateService

3. **Authentication failures**: 
   - Verify API endpoints are correct
   - Check cookie-based authentication is working
   - Verify `withCredentials` is enabled

4. **State not saving**: 
   - Check that data is properly stringified before sending
   - Verify MODEL_CALC_COMPLETE events are firing
   - Check debounce delay (500ms)

5. **State not loading**: 
   - Verify LoadState API returns expected format
   - Check questionToSend matches backend questions
   - Verify CalcService is initialized before restore

### Debug Mode

Enable detailed logging by checking browser console for:
- 📝 Config loading messages
- 🌐 API call logs (LoadState, RetainState)
- ✅ State save/load confirmations
- ⚠️ Error details with stack traces
- 📊 Value extraction summaries

### Debugging Tips

```typescript
// Check if backend is available
import { checkBackendAvailability } from '@/services/stateService';
const isAvailable = await checkBackendAvailability();

// Check localStorage state
const appStorage = JSON.parse(localStorage.getItem('appStorage') || '{}');

// Check current CalcService values
const modelState = calcService.getModelState();
const value = calcService.getValue('tlInputTeamRound', true);
```

## Related Files

### Core Backend Integration Files

1. **`src/services/stateService.ts`** - API communication layer
2. **`src/services/calcConnector.ts`** - CalcService abstraction
3. **`src/contexts/ModelStorageContext.tsx`** - Main orchestration
4. **`src/utils/config.ts`** - Configuration management

### Unused but Available

5. **`src/services/stateThrottler.ts`** - Queue-based throttling (not currently used)

### Configuration Files

6. **`public/config.json`** - Runtime configuration (API URL, questions)

## Future Enhancements (If Needed)

Potential improvements if you need more sophistication later:

1. **Change Detection**: Only save if values actually changed (currently saves every debounced call)
   - Could use StateThrottler's `hasValueChanged()` function

2. **Queueing**: If you need guaranteed order/retry logic
   - StateThrottler provides queue-based uploads

3. **Request Cancellation**: If you want to cancel pending saves
   - StateThrottler has `cancel()` method

4. **Offline Support**: Queue saves when offline, sync when back online
   - Could integrate with service workers

But for now, **debouncing is sufficient** for preventing excessive API calls, and the current implementation is simple and maintainable.
