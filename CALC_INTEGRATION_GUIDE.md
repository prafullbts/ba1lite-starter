# Calculation Engine Integration Guide

This guide explains how to use the calculation engine integration in your React project.

## Overview

The calculation engine integration provides:
- **CalcProvider**: React context that manages the calculation model
- **ProtectedRoute**: Component that protects routes during model loading
- **CalcValue**: Component for displaying calculated values
- **SplashScreen**: Loading screen shown during model initialization

## Architecture

```
React UI ←→ CalcService ←→ [Your Calculation Model]-require.js
```

- **React**: Handles UI and user interactions
- **CalcService**: Bridges between React and the calculation model
- **[Your Calculation Model]-require.js**: Handles all calculations
- **Values**: Displayed using refNames (like "tlOutput_MyValue")

## Setup (Already Complete)

The integration is already set up in your project:

1. ✅ **CalcProvider** wraps your entire app in `src/App.tsx`
2. ✅ **ProtectedRoute** protects all routes during model loading
3. ✅ **SplashScreen** shows during initialization
4. ✅ **Loading route** (`/loading`) handles the splash screen

## Using CalcValue Component

### Basic Usage

```tsx
import { CalcValue } from '@/components/calc/CalcValue';

// Simple value display
<CalcValue refName="tlOutput_MyValue" />

// With formatting
<CalcValue 
  refName="tlOutput_MyValue" 
  format="currency" 
  fallback="$0.00m"
/>
```

### Available Formats

- `currency`: Displays as currency (e.g., "$1.50m")
- `percentage`: Displays as percentage (e.g., "15.5%")
- `number`: Displays as formatted number (e.g., "1,234.56")
- `text`: Displays as plain text

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `refName` | string | required | The reference name from your model |
| `format` | 'currency' \| 'percentage' \| 'number' \| 'text' | 'text' | Display format |
| `prefix` | string | '' | Text to show before the value |
| `suffix` | string | '' | Text to show after the value |
| `decimals` | number | 2 | Number of decimal places |
| `fallback` | string | '0' | Value to show if calculation fails |
| `className` | string | '' | CSS classes to apply |

### Examples

```tsx
// Currency with custom prefix
<CalcValue 
  refName="tlOutput_Revenue" 
  format="currency" 
  prefix="Revenue: "
  fallback="$0.00m"
/>

// Percentage with 1 decimal place
<CalcValue 
  refName="tlOutput_Margin" 
  format="percentage" 
  decimals={1}
  fallback="0.0%"
/>

// Number with thousands separator
<CalcValue 
  refName="tlOutput_Units" 
  format="number" 
  suffix=" units"
  fallback="0 units"
/>
```

## Using the Calc Context

### Accessing the Context

```tsx
import { useCalc } from '@/contexts/CalcContext';

function MyComponent() {
  const { 
    getValue, 
    setValue, 
    isInitialized, 
    isLoading, 
    error 
  } = useCalc();

  // Get a value
  const revenue = getValue('tlOutput_Revenue');

  // Set a value
  const handleUpdate = async () => {
    await setValue('tlInput_Price', 100, 'MyComponent');
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Revenue: {revenue}</p>
      <button onClick={handleUpdate}>Update Price</button>
    </div>
  );
}
```

### Available Methods

- `getValue(refName, rawValue?)`: Get a calculated value
- `setValue(refName, value, componentName?)`: Set an input value
- `getValueForYear(refName, yearRef?, rawValue?)`: Get value for specific year
- `setValueForYear(refName, value, yearRef, componentName?)`: Set value for specific year
- `reinitialize()`: Reinitialize the calculation model
- `forceUpdate()`: Force re-render of all CalcValue components

## Using the useCalcValue Hook

For more control over value updates:

```tsx
import { useCalcValue } from '@/hooks/useCalcValue';

function MyComponent() {
  const revenue = useCalcValue('tlOutput_Revenue');
  const margin = useCalcValue('tlOutput_Margin', true); // raw value

  return (
    <div>
      <p>Revenue: {revenue}</p>
      <p>Margin: {margin}</p>
    </div>
  );
}
```

## Testing the Integration

### Test Pages

1. **Main Dashboard**: Visit `/dashboard` to see CalcValue components in action
2. **Test Page**: Visit `/calc-test` for comprehensive testing and examples

### Test Flow

1. Start the app: `npm run dev`
2. You'll see the splash screen while the model loads
3. Once loaded, you'll be redirected to the main app
4. Visit `/calc-test` to test different values and formats
5. Use the test page to set values and see them update in real-time

## Troubleshooting

### Model Not Loading

- Check browser console for errors
- Verify `public/jsCalc.src.js` and your calculation model's require.js file exist in the public directory
- Try clearing localStorage: `localStorage.removeItem('MODEL_STATE')`

### Values Not Updating

- Ensure the refName exists in your model
- Check that the calculation model has been initialized
- Use the debug information on `/calc-test` to see available named ranges

### Common Issues

1. **"#N/A" values**: The refName doesn't exist in the model
2. **Loading stuck**: Clear localStorage and refresh
3. **Values not updating**: Check if the model is recalculating

## File Structure

```
src/
├── contexts/
│   └── CalcContext.tsx          # Main context provider
├── components/
│   ├── calc/
│   │   └── CalcValue.tsx        # Value display component
│   ├── ProtectedRoute.tsx       # Route protection
│   └── SplashScreen.tsx         # Loading screen
├── hooks/
│   └── useCalcValue.ts          # Value hook
├── services/
│   ├── calc.service.ts          # Main calculation service
│   ├── calc-initializer.ts      # Model initialization
│   └── model-loader.service.ts  # Model loading
└── pages/
    └── CalcTestPage.tsx         # Test page
```

## Next Steps

1. Replace test refNames with your actual model refNames
2. Add CalcValue components to your existing pages
3. Use the context methods to set values from user inputs
4. Customize the SplashScreen if needed
5. Add error handling for your specific use cases

## Support

If you encounter issues:
1. Check the browser console for errors
2. Use the debug information on `/calc-test`
3. Verify your model file structure
4. Test with the provided examples first
