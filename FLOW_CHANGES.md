# Flow Changes Summary

## What Changed: Before vs After Simplification

### Before (Over-Engineered)

#### Configuration
- **Two separate arrays**: `questionToSend` AND `questionsToReceive`
- `questionToSend`: Used for reading values from CalcService and saving to backend
- `questionsToReceive`: Used for filtering which questions to write back to CalcService
- Logic: "Send these, receive those"

#### Save Flow
```
MODEL_CALC_COMPLETE event
  → StateThrottler.queueUpload()
    → Check if active request exists (queue if busy)
    → readValuesFromCalc(questionToSend)
    → Compare with lastSavedValues (change detection)
    → Skip save if no changes detected
    → Update localStorage
    → Save to backend (RetainState)
    → Update lastSavedValues
    → Process queued request if any
```

#### Load Flow
```
App Initialization
  → loadStateFromBackend(questionToSend)
    → LoadState API call
    → Extract model_state and individual values
    → Store in appStorage
  → writeValuesToCalc(questionsToReceive)
    → Filter values by questionsToReceive
    → Apply model_state
    → Apply individual question values (overrides)
```

### After (Simplified)

#### Configuration
- **Single array**: `questionToSend` only
- Used for both reading from CalcService AND writing back to CalcService
- Logic: "These are the questions we care about"

#### Save Flow
```
MODEL_CALC_COMPLETE event
  → Debounced (500ms) saveStateToBackend()
    → readValuesFromCalc(questionToSend)
    → Update localStorage
    → Save to backend (RetainState)
```

#### Load Flow
```
App Initialization
  → loadStateFromBackend(questionToSend)
    → LoadState API call
    → Extract model_state and individual values
    → Store in appStorage
  → writeValuesToCalc(questionToSend)
    → Filter values by questionToSend (same array!)
    → Apply model_state
    → Apply individual question values (overrides)
  → Sync initial values to backend
    → Read all current values from CalcService (questionToSend)
    → Save to backend (RetainState)
    → Backend now has all initial values from calcModel
```

## Key Simplifications

### 1. Single Configuration Array
- **Before**: Two arrays (`questionToSend`, `questionsToReceive`) that often had similar/duplicate values
- **After**: One array (`questionToSend`) used everywhere

### 2. Removed Queueing System
- **Before**: `StateThrottler` with active request tracking, queuing, and change detection
- **After**: Simple debouncing (500ms) handles rapid saves

### 3. Removed Change Detection
- **Before**: Compared current values vs `lastSavedValues`, skip save if no changes
- **After**: Always save on `MODEL_CALC_COMPLETE` (debouncing handles frequency)

### 4. Simpler Function Parameters
- **Before**: `writeValuesToCalc(calcService, values, questionsToReceive)`
- **After**: `writeValuesToCalc(calcService, values, questionToSend)`

## Flow Comparison

### On App Load

**Before:**
```
1. LoadState API (questionToSend) → appStorage
2. Filter by questionsToReceive → writeValuesToCalc(questionsToReceive)
```

**After:**
```
1. LoadState API (questionToSend) → appStorage
2. Filter by questionToSend → writeValuesToCalc(questionToSend)
3. Sync all initial values → RetainState API (ensures backend has all calcModel values)
```

**Result**: Same behavior, plus initial sync ensures backend has all values from calcModel (even blanks).

### On State Changes

**Before:**
```
MODEL_CALC_COMPLETE
  → Queue check
  → Read values (questionToSend)
  → Change detection
  → Skip if no changes
  → Save to backend
```

**After:**
```
MODEL_CALC_COMPLETE
  → Debounce (500ms)
  → Read values (questionToSend)
  → Save to backend
```

**Result**: Simpler, debouncing prevents excessive calls without complex queueing.

## Benefits

1. **Less Configuration**: One array instead of two
2. **Simpler Code**: ~200 lines removed (StateThrottler, change detection)
3. **Easier to Understand**: Direct flow without queue management
4. **Still Efficient**: Debouncing prevents excessive API calls
5. **Single Source of Truth**: `questionToSend` defines what questions matter

## What Stayed the Same

- ✅ LoadState on app initialization
- ✅ Apply model_state first, then individual values (overrides)
- ✅ Debounced saves on MODEL_CALC_COMPLETE
- ✅ CalcConnector read/write abstraction
- ✅ localStorage sync

## New Feature: Initial Value Sync

After loading state from backend and applying it to CalcService, the app now syncs all initial values back to the backend. This ensures:

- ✅ Backend has all values from calcModel (including blanks/defaults)
- ✅ First-time users: All initial values are saved to backend
- ✅ Returning users: Values are restored, then synced (ensures consistency)

The flow now: Load state on refresh → apply to CalcService → sync all initial values → save on changes (with debouncing).

