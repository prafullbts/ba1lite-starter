# Behavioral Changes: Before vs After

## Summary
**TL;DR: Almost no functional changes - mostly code cleanup. One potential edge case difference with type coercion.**

---

## 1. Change Detection: What Actually Changed?

### Old Logic:
```typescript
const changedQuestions = questionsToSend.filter(q => {
  const current = currentValues[q];
  const last = lastSavedValues[q];
  
  // If both are undefined/empty, no change
  if ((!current || current === '') && (!last || last === '')) {
    return false;
  }
  
  // If one exists and the other doesn't, it's a change
  if ((current && current !== '') !== (last && last !== '')) {
    return true;
  }
  
  // Both exist, compare values
  return current !== last;  // <-- STRICT comparison (no type coercion)
});
```

### New Logic:
```typescript
const hasValueChanged = (current: string | undefined, last: string | undefined): boolean => {
  // Normalize to strings first
  const currentNormalized = current !== null && current !== undefined && current !== '' ? String(current) : '';
  const lastNormalized = last !== null && last !== undefined && last !== '' ? String(last) : '';
  
  // ... same logic but compares normalized strings
  return currentNormalized !== lastNormalized;  // <-- STRING comparison (with type coercion)
};
```

### Key Difference: **Type Coercion**

| Scenario | Old Behavior | New Behavior | Impact |
|----------|-------------|--------------|--------|
| `null` → `undefined` | No change (both falsy) | No change (both normalized to '') | ✅ Same |
| `undefined` → `''` | No change (both falsy) | No change (both normalized to '') | ✅ Same |
| `''` → `'hello'` | Change detected | Change detected | ✅ Same |
| `5` → `'5'` | **Change detected** (different types) | **No change** (both → `'5'`) | ⚠️ **Different** |
| `'5'` → `5` | **Change detected** (different types) | **No change** (both → `'5'`) | ⚠️ **Different** |
| `5` → `5` | No change | No change | ✅ Same |

### Real Impact:
Looking at the actual code flow:

1. **`currentValues` always contains strings:**
   - Line 202: `const valueStr = String(rawValue)` → converts to string
   - Line 211: `currentValues[question] = valueStr` → stores string
   - Line 236: `currentValues[question] = typeof value === 'string' ? value : JSON.stringify(value)` → always string

2. **`lastSavedValues` typically contains strings:**
   - Comes from backend responses (JSON, always strings)
   - Or from `appStorage` (localStorage stores as strings)

**In practice, this difference should NOT matter** because:
- ✅ All values are normalized to strings before comparison
- ✅ CalcService values are converted via `String(rawValue)`
- ✅ Backend responses are JSON strings
- ✅ localStorage stores everything as strings

**The type coercion in the new code matches what was already happening in practice.**

**But if there's a case where:**
- `lastSavedValues[q] = 5` (number stored)
- `currentValues[q] = '5'` (string from CalcService)

**Old:** Would detect as changed → sends to backend  
**New:** Would NOT detect as changed → doesn't send

### Recommendation:
This edge case is probably fine since values are typically strings, but if you want to be safe, we could keep strict comparison:

```typescript
// Keep strict comparison if types differ
if (typeof current !== typeof last) {
  return true; // Type change = value change
}
// Then normalize and compare
```

---

## 2. Debouncing: What Actually Changed?

### Old Implementation:
```typescript
const saveDebounceRef = React.useRef<number | null>(null);

const onCalcComplete = () => {
  if (saveDebounceRef.current) {
    clearTimeout(saveDebounceRef.current);
  }
  saveDebounceRef.current = window.setTimeout(async () => {
    await saveStateToBackend(...);
  }, 500);
};

// Cleanup
if (saveDebounceRef.current) {
  clearTimeout(saveDebounceRef.current);
}
```

### New Implementation:
```typescript
const debouncedSave = debounceAsync(async () => {
  await saveStateToBackend(...);
}, 500);

const onCalcComplete = () => {
  debouncedSave();
};
```

### Behavioral Difference: **NONE** ✅

Both implementations:
- Wait 500ms after last `MODEL_CALC_COMPLETE` event
- Cancel previous pending saves if new event arrives
- Call `saveStateToBackend` after delay
- Handle cleanup on unmount

**This is purely a code cleanup** - functionality is identical.

---

## Summary Table

| Change | Functional Impact | Risk Level |
|--------|------------------|------------|
| **Change Detection (type coercion)** | Possible edge case with number/string | 🟡 Low (values are strings anyway) |
| **Debouncing** | None (code cleanup only) | 🟢 None |

---

## Should We Revert or Adjust?

### Option 1: Keep as-is (Recommended)
- Edge case is unlikely
- Values are typically strings
- Code is cleaner

### Option 2: Add Type Check
- Add explicit type comparison before normalization
- More conservative, handles edge cases

### Option 3: Revert Change Detection
- Go back to old logic
- If you want to be 100% safe

**My recommendation: Keep as-is**, since the edge case is very unlikely given how values flow through the system. But I can add the type check if you prefer more conservative behavior.

