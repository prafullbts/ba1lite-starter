import React from 'react';
import { CalcValue } from '../components/calc/CalcValue';
import { useCalc } from '../contexts/CalcContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export const CalcTestPage = () => {
  const { setValue, isInitialized, calcService } = useCalc();
  const [testValue, setTestValue] = React.useState('1000000');

  const handleSetValue = async () => {
    try {
      await setValue('tlInput_TestValue', parseFloat(testValue), 'CalcTestPage');
      console.log('Value set successfully');
    } catch (error) {
      console.error('Failed to set value:', error);
    }
  };

  const handleSetRandomValue = async () => {
    const randomValue = Math.floor(Math.random() * 1000000);
    try {
      await setValue('tlInput_TestValue', randomValue, 'CalcTestPage');
      setTestValue(randomValue.toString());
      console.log('Random value set successfully');
    } catch (error) {
      console.error('Failed to set random value:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Calculation Test Page</CardTitle>
            <CardDescription>Loading calculation model...</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please wait while the calculation model initializes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculation Engine Test Page</CardTitle>
          <CardDescription>
            This page demonstrates how to use the CalcValue component to display values from your calculation model.
            The values are automatically updated when the underlying model recalculates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Value Input */}
          <div className="space-y-2">
            <Label htmlFor="testValue">Test Input Value</Label>
            <div className="flex gap-2">
              <Input
                id="testValue"
                type="number"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder="Enter a number"
              />
              <Button onClick={handleSetValue}>Set Value</Button>
              <Button onClick={handleSetRandomValue} variant="outline">
                Random Value
              </Button>
            </div>
          </div>

          {/* Display Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Currency Format */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Currency Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CalcValue 
                    refName="tlInput_TestValue" 
                    format="currency" 
                    fallback="$0.00m"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  refName: "tlInput_TestValue"
                </p>
              </CardContent>
            </Card>

            {/* Percentage Format */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Percentage Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CalcValue 
                    refName="tlInput_TestValue" 
                    format="percentage" 
                    fallback="0%"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  refName: "tlInput_TestValue"
                </p>
              </CardContent>
            </Card>

            {/* Number Format */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Number Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CalcValue 
                    refName="tlInput_TestValue" 
                    format="number" 
                    fallback="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  refName: "tlInput_TestValue"
                </p>
              </CardContent>
            </Card>

            {/* Text Format */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Text Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CalcValue 
                    refName="tlInput_TestValue" 
                    format="text" 
                    fallback="N/A"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  refName: "tlInput_TestValue"
                </p>
              </CardContent>
            </Card>

            {/* Custom Prefix/Suffix */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Custom Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CalcValue 
                    refName="tlInput_TestValue" 
                    format="number" 
                    prefix="Value: "
                    suffix=" units"
                    fallback="0 units"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  refName: "tlInput_TestValue"
                </p>
              </CardContent>
            </Card>

            {/* Different Decimals */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">4 Decimals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CalcValue 
                    refName="tlInput_TestValue" 
                    format="number" 
                    decimals={4}
                    fallback="0.0000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  refName: "tlInput_TestValue"
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Example Usage Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Example Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Basic usage
<CalcValue refName="tlInput_TestValue" />

// With formatting
<CalcValue 
  refName="tlInput_TestValue" 
  format="currency" 
  fallback="$0.00m"
/>

// With custom prefix/suffix
<CalcValue 
  refName="tlInput_TestValue" 
  format="number" 
  prefix="Value: "
  suffix=" units"
  decimals={2}
/>

// Using the hook directly
const value = useCalcValue("tlInput_TestValue");`}
              </pre>
            </CardContent>
          </Card>

          {/* Debug Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Model Initialized:</strong> {isInitialized ? 'Yes' : 'No'}</p>
                <p><strong>Calc Service Available:</strong> {calcService ? 'Yes' : 'No'}</p>
                {calcService && (
                  <>
                    <p><strong>Available Named Ranges:</strong></p>
                    <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                      {calcService.getAvailableNamedRanges().slice(0, 20).map((name, index) => (
                        <div key={index} className="text-xs font-mono">
                          {name}
                        </div>
                      ))}
                      {calcService.getAvailableNamedRanges().length > 20 && (
                        <div className="text-xs text-gray-500">
                          ... and {calcService.getAvailableNamedRanges().length - 20} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalcTestPage;
