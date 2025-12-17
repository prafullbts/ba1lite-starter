import React, { useState, useEffect } from 'react';
import { useCalc } from '@/contexts/CalcContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalcInput } from '@/components/calc/CalcInput';
import { CalcValue } from '@/components/calc/CalcValue';
import { Label } from '@/components/ui/label';

interface CellReference {
  rangeID: string;
  type: 'ref' | 'val';
}

interface CalcDebuggerEquationProps {
  refName: string;
  onJumpTo?: (ref: string) => void;
  depth?: number;
}

const CalcDebuggerEquation: React.FC<CalcDebuggerEquationProps> = ({ 
  refName, 
  onJumpTo,
  depth = 0 
}) => {
  const { calcService, isInitialized } = useCalc();
  const [expanded, setExpanded] = useState(false);
  const [targetCellRef, setTargetCellRef] = useState<any>(null);
  const [targetCellReferenceList, setTargetCellReferenceList] = useState<CellReference[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [formula, setFormula] = useState<string>('');

  useEffect(() => {
    if (!calcService || !isInitialized || !refName || !calcService.isApiReady()) {
      setTargetCellRef(null);
      setTargetCellReferenceList([]);
      return;
    }

    try {
      const targetCell = calcService.getRangeRef(refName);
      if (!targetCell) {
        setTargetCellRef(null);
        setTargetCellReferenceList([]);
        return;
      }

      if (typeof targetCell.getSingleCellReference === 'function') {
        try {
          const singleCellRef = targetCell.getSingleCellReference();
          if (!singleCellRef) {
            setTargetCellRef(null);
            setTargetCellReferenceList([]);
            return;
          }

          setTargetCellRef(singleCellRef);

          // Check if cell has a formula/expression
          if (singleCellRef?.debugExpressionData) {
            try {
              const references = calcService.getCellReferences(
                singleCellRef.debugExpressionData,
                singleCellRef
              );
              setTargetCellReferenceList(Array.isArray(references) ? references : []);
              
              // Try to get the formula string
              let formulaStr = '';
              if (singleCellRef.formula) {
                formulaStr = singleCellRef.formula;
              } else if (singleCellRef.debugExpressionData) {
                // Try to construct a readable formula from expression data
                try {
                  // Check if there's a toString or similar method
                  if (typeof singleCellRef.debugExpressionData.toString === 'function') {
                    formulaStr = singleCellRef.debugExpressionData.toString();
                  } else if (singleCellRef.debugExpressionData.type === 'wsFunc' && singleCellRef.debugExpressionData.name) {
                    // For worksheet functions, show the function name
                    formulaStr = `=${singleCellRef.debugExpressionData.name}(...)`;
                  } else if (singleCellRef.debugExpressionData.type === 'binary' && singleCellRef.debugExpressionData.operator) {
                    // For binary operations, show the operator
                    formulaStr = `... ${singleCellRef.debugExpressionData.operator} ...`;
                  } else {
                    // Fallback: show a simplified representation
                    formulaStr = 'Formula (see references below)';
                  }
                } catch {
                  formulaStr = 'Formula (see references below)';
                }
              }
              setFormula(formulaStr);
            } catch (error) {
              console.warn('Error getting cell references:', error);
              setTargetCellReferenceList([]);
              setFormula('');
            }
          } else {
            // No debugExpressionData - treat as simple value (editable)
            setTargetCellReferenceList([]);
            setFormula('');
          }
        } catch (error) {
          console.warn('Error getting single cell reference:', error);
          // Fallback: use targetCell directly
          setTargetCellRef(targetCell);
          setTargetCellReferenceList([]);
        }
      } else {
        // If getSingleCellReference doesn't exist, use targetCell directly
        setTargetCellRef(targetCell);
        setTargetCellReferenceList([]);
      }
    } catch (error) {
      console.error('Error processing ref:', refName, error);
      setTargetCellRef(null);
      setTargetCellReferenceList([]);
    }
  }, [refName, calcService]);

  if (!targetCellRef) {
    return null;
  }

  const handleRefClick = (ref: string) => {
    if (onJumpTo) {
      onJumpTo(ref);
    }
  };

  // Check if cell has a formula - if it has debugExpressionData, it's an output (calculated)
  const hasFormula = targetCellRef?.debugExpressionData !== undefined;
  const hasReferences = targetCellReferenceList.length > 0;
  
  // A hardcoded constant (like "100") might have debugExpressionData but no references
  // If there are no references, it's likely just a constant value that should be editable
  // Only if it has references (actual formula dependencies) is it a true calculated output
  const isHardcodedConstant = hasFormula && !hasReferences;
  const isSimpleValue = !hasFormula || isHardcodedConstant;

  return (
    <div className="cdec-wrapper" style={{ marginLeft: `${depth * 20}px` }}>
      <div className="space-y-3">
        {/* Reference and Value Row */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Reference
            </div>
            <div 
              className="font-mono text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              {refName}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Value
            </div>
            {isSimpleValue ? (
              <div className="mt-1">
                <CalcInput refName={refName} />
              </div>
            ) : (
              <div 
                className={`font-mono text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors ${
                  expanded ? 'break-words' : 'truncate'
                }`}
                onClick={() => setExpanded(!expanded)}
                title="Click to expand"
              >
                <CalcValue refName={refName} />
              </div>
            )}
          </div>
        </div>

        {/* Formula Display - Show for outputs with actual formulas (not hardcoded constants) */}
        {hasFormula && hasReferences && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Formula
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 font-mono text-xs text-gray-800 break-all">
              {formula || 'Formula (see references below)'}
            </div>
          </div>
        )}

        {/* References List */}
        {hasReferences && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Formula References ({targetCellReferenceList.length})
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {targetCellReferenceList.map((referenceItem, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-mono text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors mb-1"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      >
                        {referenceItem.rangeID}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {referenceItem.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          <CalcValue refName={referenceItem.rangeID} />
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefClick(referenceItem.rangeID)}
                        className="text-xs h-7"
                      >
                        Start From here
                      </Button>
                    </div>
                  </div>
                  {expandedIndex === index && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <CalcDebuggerEquation
                        refName={referenceItem.rangeID}
                        onJumpTo={onJumpTo}
                        depth={depth + 1}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CalcDebugger: React.FC = () => {
  const { calcService, isInitialized } = useCalc();
  const [rangeRef, setRangeRef] = useState<string>('');
  const [isValidRef, setIsValidRef] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string>('');

  const handleInputChange = (value: string) => {
    setRangeRef(value);
    if (!calcService || !isInitialized || !value || !calcService.isApiReady()) {
      setIsValidRef(false);
      setCurrentValue('');
      return;
    }

    try {
      const targetCell = calcService.getRangeRef(value);
      // Check if targetCell is valid - it should be truthy and not null/undefined
      const isValid = targetCell !== null && targetCell !== undefined;
      setIsValidRef(isValid);
      
      if (isValid) {
        try {
          // Get current value for display
          const cellValue = calcService.getValue(value);
          setCurrentValue(cellValue != null && cellValue !== '#N/A' ? String(cellValue) : '');
        } catch (valueError) {
          // If we can't get the value, still consider it valid if we got the range ref
          setCurrentValue('');
        }
      } else {
        setCurrentValue('');
      }
    } catch (error) {
      // getRangeRef might throw for invalid refs, which is fine
      setIsValidRef(false);
      setCurrentValue('');
    }
  };

  const handleJumpTo = (ref: string) => {
    setRangeRef(ref);
    handleInputChange(ref);
  };

  // Determine if it's an input or output based on whether it has a formula WITH references
  // Hardcoded constants (formula with no references) should be treated as inputs
  const [hasFormulaForCategory, setHasFormulaForCategory] = useState<boolean>(false);
  const [hasReferencesForCategory, setHasReferencesForCategory] = useState<boolean>(false);
  
  useEffect(() => {
    if (!calcService || !isInitialized || !rangeRef || !isValidRef || !calcService.isApiReady()) {
      setHasFormulaForCategory(false);
      setHasReferencesForCategory(false);
      return;
    }

    try {
      const targetCell = calcService.getRangeRef(rangeRef);
      if (targetCell && typeof targetCell.getSingleCellReference === 'function') {
        const singleCellRef = targetCell.getSingleCellReference();
        const hasFormula = singleCellRef?.debugExpressionData !== undefined;
        setHasFormulaForCategory(hasFormula);
        
        if (hasFormula) {
          // Check if it has actual references (not just a hardcoded constant)
          try {
            const references = calcService.getCellReferences(
              singleCellRef.debugExpressionData,
              singleCellRef
            );
            setHasReferencesForCategory(Array.isArray(references) && references.length > 0);
          } catch {
            setHasReferencesForCategory(false);
          }
        } else {
          setHasReferencesForCategory(false);
        }
      } else {
        setHasFormulaForCategory(false);
        setHasReferencesForCategory(false);
      }
    } catch {
      setHasFormulaForCategory(false);
      setHasReferencesForCategory(false);
    }
  }, [rangeRef, isValidRef, calcService, isInitialized]);

  // Only treat as Output if it has a formula AND references (actual calculation)
  // Hardcoded constants (formula but no references) are Inputs
  const category = (hasFormulaForCategory && hasReferencesForCategory) ? 'Output' : 'Input';

  return (
    <div className="w-full bg-white">
      <div className="p-6 space-y-6">
        {/* Top Section - Range Details */}
        {isValidRef && rangeRef ? (
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Label htmlFor="range-ref-input" className="text-sm font-semibold text-gray-700">
                    Range Name
                  </Label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      hasFormulaForCategory && hasReferencesForCategory
                        ? 'bg-pink-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {category}
                  </span>
                </div>
                <Input
                  id="range-ref-input"
                  type="text"
                  value={rangeRef}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="bg-gray-100 border-gray-300 text-gray-900 font-mono text-sm"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 block mb-2">
                  Current Value
                </Label>
                <Input
                  type="text"
                  value={currentValue}
                  readOnly
                  className="bg-gray-100 border-gray-300 text-gray-900 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {!isInitialized && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                ⚠ Calculator service is initializing. Please wait...
              </div>
            )}
            <div>
              <Label htmlFor="range-ref-input" className="text-sm font-semibold text-gray-700 block mb-2">
                Range Name
              </Label>
              <Input
                id="range-ref-input"
                type="text"
                value={rangeRef}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter range reference (e.g., tlInputTeamNumber)"
                disabled={!isInitialized}
                className={`bg-gray-100 border-gray-300 text-gray-900 font-mono text-sm ${
                  rangeRef && !isValidRef ? 'border-red-400' : ''
                } ${!isInitialized ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {rangeRef && isInitialized && (
                <p className={`text-sm mt-2 ${isValidRef ? 'text-green-600' : 'text-red-600'}`}>
                  {isValidRef ? '✓ Valid reference' : '✗ Invalid reference'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bottom Section - Equation Breakdown */}
        {isValidRef && rangeRef && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Equation Breakdown</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CalcDebuggerEquation refName={rangeRef} onJumpTo={handleJumpTo} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
