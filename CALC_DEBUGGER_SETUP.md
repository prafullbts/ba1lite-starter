# CalcDebugger Feature - Setup and Porting Guide

## Overview

The CalcDebugger is a debugging tool that allows developers to inspect and edit calculation model values. It provides:
- **Equation Debugging**: View formula breakdowns and drill down into cell references
- **Value Editing**: Edit simple numeric values directly
- **Reference Navigation**: Jump between related cell references using "Start From here" buttons
- **Modal Interface**: Clean popup dialog for debugging without disrupting the main application

## Files Required

### Core Components

1. **`src/components/CalcDebugger.tsx`**
   - Main debugger component with equation breakdown functionality
   - Handles range reference input and validation
   - Displays formula references and allows recursive navigation

2. **`src/components/CalcDebuggerDialog.tsx`**
   - Dialog wrapper component for the modal popup
   - Handles open/close state management
   - Provides the modal UI structure

### Dependencies

The CalcDebugger relies on these existing components (should already be in your project):

- `src/components/calc/CalcInput.tsx` - Input component for editing values
- `src/components/calc/CalcValue.tsx` - Display component for showing values
- `src/contexts/CalcContext.tsx` - Provides `calcService` and `useCalc` hook
- `src/services/calc.service.ts` - Must have these methods:
  - `getRangeRef(refName: string)`
  - `getCellReferences(expression: any, curCell: any)`
  - `getContextualValue(name: string, targetCell: any)`

### UI Components (from shadcn/ui or similar)

- `src/components/ui/dialog.tsx` - Dialog/Modal component
- `src/components/ui/input.tsx` - Input field component
- `src/components/ui/button.tsx` - Button component
- `src/components/ui/label.tsx` - Label component

## Installation Steps

### Step 1: Copy Core Files

Copy these files to your new project:

```bash
# Copy the main components
cp src/components/CalcDebugger.tsx <new-project>/src/components/
cp src/components/CalcDebuggerDialog.tsx <new-project>/src/components/
```

### Step 2: Verify Dependencies

Ensure your project has:
- ✅ `CalcInput` component
- ✅ `CalcValue` component  
- ✅ `CalcContext` with `useCalc` hook
- ✅ `calc.service.ts` with required methods
- ✅ UI components (Dialog, Input, Button, Label)

### Step 3: Integrate the Trigger

The CalcDebugger can be triggered from anywhere in your application. Here are common integration points:

#### Option A: Dropdown Menu (Current Implementation)

Add to any dropdown menu component:

```tsx
import { CalcDebuggerDialog } from '@/components/CalcDebuggerDialog';
import { Bug } from 'lucide-react'; // or any icon library

function YourDropdownComponent() {
  const [calcDebuggerOpen, setCalcDebuggerOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuContent>
          {/* Other menu items */}
          <DropdownMenuItem 
            onClick={() => {
              setCalcDebuggerOpen(true);
            }}
          >
            <Bug className="mr-2 h-4 w-4" />
            <span>Calc Debugger</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CalcDebuggerDialog 
        open={calcDebuggerOpen} 
        onOpenChange={setCalcDebuggerOpen} 
      />
    </>
  );
}
```

#### Option B: Header Button

Add a button in your header/navbar:

```tsx
import { CalcDebuggerDialog } from '@/components/CalcDebuggerDialog';
import { Bug } from 'lucide-react';

function Header() {
  const [calcDebuggerOpen, setCalcDebuggerOpen] = useState(false);

  return (
    <>
      <header>
        {/* Other header content */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCalcDebuggerOpen(true)}
          title="Open Calc Debugger"
        >
          <Bug className="h-5 w-5" />
        </Button>
      </header>
      <CalcDebuggerDialog 
        open={calcDebuggerOpen} 
        onOpenChange={setCalcDebuggerOpen} 
      />
    </>
  );
}
```

#### Option C: Keyboard Shortcut (Optional)

If you want keyboard shortcut support, add to `CalcDebuggerDialog.tsx`:

```tsx
import { useEffect } from 'react';

export const CalcDebuggerDialog: React.FC<CalcDebuggerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  // Optional: Add keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === '3') {
        event.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ... rest of component */}
    </Dialog>
  );
};
```

#### Option D: Developer Tools Menu

Create a hidden developer menu accessible via a special key combination or button:

```tsx
function DeveloperTools() {
  const [showTools, setShowTools] = useState(false);
  const [calcDebuggerOpen, setCalcDebuggerOpen] = useState(false);

  return (
    <>
      {/* Hidden trigger - e.g., click logo 5 times */}
      <div onClick={() => setShowTools(!showTools)}>
        {/* Your trigger element */}
      </div>

      {showTools && (
        <div className="developer-tools-menu">
          <Button onClick={() => setCalcDebuggerOpen(true)}>
            Calc Debugger
          </Button>
        </div>
      )}

      <CalcDebuggerDialog 
        open={calcDebuggerOpen} 
        onOpenChange={setCalcDebuggerOpen} 
      />
    </>
  );
}
```

### Step 4: Verify CalcService Methods

Ensure your `calc.service.ts` has these methods that CalcDebugger depends on:

```typescript
// Required methods:
getRangeRef(refName: string): any
getCellReferences(expression: any, curCell: any, lastType?: any): Array<any>
getContextualValue(name: string, targetCell: any): any
```

If any are missing, you may need to implement them or adapt the CalcDebugger component.

## Usage

### Opening the Debugger

1. Click the trigger (dropdown item, button, etc.) to open the modal
2. Enter a range reference in the "Range Ref" input field
   - Examples: `tlInputTeamNumber`, `Calc_R2!R1031C7`, `dataBal_BU1_Rev`
3. The debugger will validate the reference and show:
   - **Green checkmark**: Valid reference
   - **Red X**: Invalid reference

### Viewing Formula Breakdowns

For calculated values (outputs with formulas):
- The debugger shows the current value
- Below, it lists all cell references used in the formula
- Click "Start From here" on any reference to drill down into that cell
- Recursively navigate through formula dependencies

### Editing Simple Values

For simple numeric values (inputs without formulas):
- The debugger shows an editable input field
- Type a new value and press Enter or click outside to save
- The value is saved directly to the calc model

## Customization

### Styling

The debugger uses inline styles for portability. To customize:

1. **Modal Size**: Edit `CalcDebuggerDialog.tsx`:
   ```tsx
   <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
   ```

2. **Component Styles**: Edit styles in `CalcDebugger.tsx`:
   - Adjust spacing, colors, borders in the inline style objects
   - Or add CSS classes and import a stylesheet

### Behavior

1. **Default Reference**: Set an initial reference in `CalcDebugger.tsx`:
   ```tsx
   const [rangeRef, setRangeRef] = useState<string>('tlInputTeamNumber');
   ```

2. **Validation**: Modify validation logic in `handleInputChange` function

3. **Value Display**: Customize how values are displayed by modifying `CalcValue` usage

## Troubleshooting

### Issue: "Cannot read property 'getSingleCellReference' of null"

**Solution**: The reference is invalid or the calc service isn't initialized. Check:
- Calc service is properly initialized
- Reference name is correct
- Model is loaded

### Issue: Values not saving

**Solution**: Check:
- `setValue` method in calc service is working
- Calc service is initialized
- Reference name is valid

### Issue: Formula breakdown not showing

**Solution**: The cell might not have `debugExpressionData`. This is normal for:
- Simple input values
- Cells without formulas
- Some jsCalc cell types

### Issue: "value.replace is not a function"

**Solution**: Ensure `CalcInput.tsx` handles non-string values:
```tsx
const valueStr = value != null ? String(value) : '';
```

## File Structure Summary

```
src/
├── components/
│   ├── CalcDebugger.tsx          # Main debugger component
│   ├── CalcDebuggerDialog.tsx    # Dialog wrapper
│   ├── calc/
│   │   ├── CalcInput.tsx         # Required dependency
│   │   └── CalcValue.tsx         # Required dependency
│   └── ui/
│       ├── dialog.tsx            # Required UI component
│       ├── input.tsx             # Required UI component
│       ├── button.tsx            # Required UI component
│       └── label.tsx             # Required UI component
├── contexts/
│   └── CalcContext.tsx           # Required context
└── services/
    └── calc.service.ts           # Required service
```

## Notes

- The debugger is designed to be **non-intrusive** - it doesn't modify the main application state
- All editing is done through the calc service, so changes persist according to your app's state management
- The component is **self-contained** and doesn't require additional routing or page setup
- Works with any trigger mechanism (button, menu, keyboard shortcut, etc.)

## Example: Complete Integration

Here's a minimal example of integrating the debugger:

```tsx
import React, { useState } from 'react';
import { CalcDebuggerDialog } from '@/components/CalcDebuggerDialog';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';

export function MyComponent() {
  const [debuggerOpen, setDebuggerOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setDebuggerOpen(true)}>
        <Bug className="mr-2 h-4 w-4" />
        Debug Calculator
      </Button>
      
      <CalcDebuggerDialog 
        open={debuggerOpen} 
        onOpenChange={setDebuggerOpen} 
      />
    </div>
  );
}
```

That's it! The debugger is now integrated and ready to use.

