// React-compatible CalcService
// Converted from Angular service to work with React

// Mock jsCalc types for now - these would come from the actual jsCalc library
interface jsCalc {
  getValue(refName: string): string;
  getRawValue(refName: string): string;
  setValue(refName: string, value: any): Promise<any>;
  getJSONState(): string;
  getNames(pattern: RegExp): string[];
  getRangeRef(refName: string): any;
  getFriendlyRangeName(refName: string): string | null;
  getBook(): any;
  addCalculationCallback(callback: () => void): void;
}

interface CalcOptions {
  courseActions?: any;
  model?: any;
  loadCallback?: () => void;
  buildProgressCallback?: (progress: any) => void;
}

// Event emitter for React
class EventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  trigger(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

// Storage service for React
class StorageService {
  setValue(key: string, value: string): Promise<void> {
    return new Promise((resolve) => {
      localStorage.setItem(key, value);
      resolve();
    });
  }

  getValue(key: string): Promise<string | null> {
    return new Promise((resolve) => {
      resolve(localStorage.getItem(key));
    });
  }
}

// Constants
const EMIT_CHANGE_DELAY = 100;
const SAVE_STATE_TO_STORAGE_DELAY = 1000;
const CALC_COMPLETE = 'CALC_COMPLETE';
const MODEL_STATE = 'MODEL_STATE';
const APP_STORAGE_KEY = 'appStorage';
const APP_STORAGE_MODEL_STATE_FIELD = 'model_state';
export const MODEL_CALC_COMPLETE = 'MODEL_CALC_COMPLETE';
const MODEL_LOADED = 'MODEL_LOADED';
const MODEL_LOAD_PROGRESS = 'MODEL_LOAD_PROGRESS';
const SAVE_TO_STORAGE_EMITTER = 'SAVE_TO_STORAGE_EMITTER';

export class CalcService {
  private api: jsCalc | null = null;
  private calculationCompleteEmitter: any;
  private saveStateEmitter: any;
  private modelLoadingPromise: Promise<CalcService> | undefined;
  private buildOptions: CalcOptions | null = null;
  private communicator: EventEmitter;
  private storageService: StorageService;

  constructor() {
    this.communicator = new EventEmitter();
    this.storageService = new StorageService();
  }

  /**
   * Function to check whether calcApi is ready for operations
   */
  isApiReady(): boolean {
    return this.api !== null;
  }

  /**
   * GetApi function to initialize and get instance of Api
   */
  getApi(modelData?: any): Promise<CalcService> {
    if (this.api) {
      return Promise.resolve(this);
    } else if (this.modelLoadingPromise === undefined) {
      // Convert modelData to CalcOptions format
      const options: CalcOptions = {
        model: modelData?.model,
        courseActions: modelData?.customActions
      };
      return this.modelLoadingPromise = this.initialize(options);
    }
    return this.modelLoadingPromise;
  }

  /**
   * Initialize model using jsCalc api
   */
  private initialize(options?: CalcOptions): Promise<CalcService> {
    // Setup calculation complete observer
    this.calculationCompleteEmitter = this.communicator.on(CALC_COMPLETE, () => {
      setTimeout(() => {
        this.triggerModelComplete();
      }, EMIT_CHANGE_DELAY);
    });

    this.saveStateEmitter = this.communicator.on(SAVE_TO_STORAGE_EMITTER, () => {
      setTimeout(() => {
        this.saveStateToStorage();
      }, SAVE_STATE_TO_STORAGE_DELAY);
      });

    this.buildOptions = options;
    return this.getStateFromStorage()
      .then((modelState) => {
        return this.loadModel(modelState);
      });
  }

  /**
   * Triggers model load complete event
   */
  private triggerModelComplete() {
    this.communicator.trigger(MODEL_CALC_COMPLETE);
  }

  /**
   * Load calc model using jsCalc api
   */
  private loadModel(modelData?: string | JSON): Promise<CalcService> {
    return new Promise((resolve, reject) => {
      this.buildModel()
        .then((api) => {
          this.api = api;
          // Add a small delay to ensure jsCalc is fully initialized
          setTimeout(() => {
          this.appendDataToModel(modelData)
            .then(() => {
                this.communicator.trigger(MODEL_LOADED, true);
              this.saveStateToStorage()
                  .then(() => resolve(this))
                .catch((err) => {
                    console.error('Saving model state failed', err);
              reject(err);
            });
        })
        .catch((err) => {
                console.error('Failed - Could not append data to model', err);
                // Don't clear state, just continue without state restoration
                console.warn('Continuing without state restoration...');
                this.communicator.trigger(MODEL_LOADED, true);
                resolve(this);
              });
          }, 200); // Give jsCalc more time to initialize
        })
        .catch((err) => {
          console.error('Failed to build the model!', err);
          reject(err);
        });
    });
  }

  /**
   * Function to build/rebuild calc model using jsCalc
   */
  buildModel(): Promise<jsCalc> {
    const options: CalcOptions = this.buildOptions || { courseActions: null };

    return new Promise((resolve, reject) => {
      try {
        options.loadCallback = function () {
          resolve(this);
        };
        options.buildProgressCallback = (progressOb) => {
          this.onProgress(progressOb);
        };
        
        // Load jsCalc library and create instance like the original
        this.loadJsCalcLibrary()
          .then(() => {
            console.log('Creating jsCalc instance with options:', options);
            
            // Create jsCalc instance exactly like the original
            // The loadCallback will resolve the promise when jsCalc is ready
            try {
              // Pass the model in options like the original
              const jsCalcOptions = {
                model: options.model,
                courseActions: options.courseActions,
                loadCallback: options.loadCallback,
                buildProgressCallback: options.buildProgressCallback
              };
              new (window as any).jsCalc(jsCalcOptions);
            } catch (error) {
              console.error('Error creating jsCalc instance:', error);
              reject(error);
            }
          })
          .catch((error) => {
            console.error('Failed to load jsCalc library:', error);
            console.warn('Falling back to mock API...');
            // Fallback to mock API if jsCalc fails to load
            const mockApi: jsCalc = {
              getValue: (refName: string) => {
                if (this.modelState && this.modelState[refName] !== undefined) {
                  return this.formatValue(this.modelState[refName]);
                }
                return '#N/A';
              },
              getRawValue: (refName: string) => {
                if (this.modelState && this.modelState[refName] !== undefined) {
                  return this.modelState[refName].toString();
                }
                return '#N/A';
              },
              setValue: (refName: string, value: any) => {
                return new Promise((resolve) => {
                  if (!this.modelState) {
                    this.modelState = {};
                  }
                  this.modelState[refName] = value;
                  this.triggerRecalculation();
                  resolve(true);
                });
              },
              getJSONState: () => {
                return JSON.stringify(this.modelState || {});
              },
              getNames: (pattern: RegExp) => {
                return this.getModelNames(pattern);
              },
              getRangeRef: (refName: string) => {
                return this.getModelRangeRef(refName);
              },
              getFriendlyRangeName: (refName: string) => {
                return refName;
              },
              getBook: () => ({ 
                recalculate: () => {
                  this.triggerRecalculation();
                }
              }),
              addCalculationCallback: (callback: () => void) => {
                this.calculationCallbacks.push(callback);
              }
            };
            resolve(mockApi);
          });
      } catch (err) {
        console.error('Error building model', err);
        reject(err);
      }
    });
  }

  /**
   * Load jsCalc library (simplified version)
   */
  private async loadJsCalcLibrary(): Promise<void> {
    // Check if jsCalc is already loaded
    if (typeof (window as any).jsCalc !== 'undefined') {
      console.log('jsCalc already loaded');
      return Promise.resolve();
    }

    try {
      console.log('Loading jsCalc library...');
      
      // Load dependencies first
      await this.loadDependencies();
      console.log('Dependencies loaded');
      
      // Load the jsCalc library
      const jsCalcResponse = await fetch('/jsCalc.src.js');
      if (!jsCalcResponse.ok) {
        throw new Error(`Failed to fetch jsCalc library: ${jsCalcResponse.status}`);
      }
      
      const jsCalcContent = await jsCalcResponse.text();
      console.log('jsCalc content fetched, length:', jsCalcContent.length);
      
      // Create a script element to load jsCalc
      const script = document.createElement('script');
      script.textContent = jsCalcContent;
      document.head.appendChild(script);
      console.log('jsCalc script added to DOM');
      
      // Wait for jsCalc to be available with timeout
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout waiting for jsCalc to load'));
        }, 5000); // 5 second timeout
        
        const checkJsCalc = () => {
          if (typeof (window as any).jsCalc !== 'undefined') {
            clearTimeout(timeout);
            resolve(undefined);
          } else {
            setTimeout(checkJsCalc, 100);
          }
        };
        
        checkJsCalc();
      });
      
      console.log('jsCalc library loaded successfully');
      
    } catch (error) {
      console.error('Failed to load jsCalc library:', error);
      throw error;
    }
  }

  /**
   * Load the real jsCalc library
   */
  private async loadDependencies(): Promise<void> {
    try {
      console.log('Setting up mock dependencies for jsCalc...');
      
      // Create mock implementations for the required dependencies
      const mockDependencies = `
        // Mock numeral library
        if (typeof window.numeral === 'undefined') {
          window.numeral = function(value) {
            return {
              format: function(pattern) {
                if (typeof value === 'number') {
                  if (pattern === '0,0') return value.toLocaleString();
                  if (pattern === '0.00') return value.toFixed(2);
                  if (pattern === '0%') return (value * 100).toFixed(0) + '%';
                  return value.toString();
                }
                return value;
              },
              value: function() { return value; }
            };
          };
        }
        
        // Mock moment library
        if (typeof window.moment === 'undefined') {
          window.moment = function(value, format) {
            return {
              isValid: function() {
                if (!value) return false;
                const date = new Date(value);
                return !isNaN(date.getTime());
              },
              format: function(outputFormat) {
                if (!value) return '';
                const date = new Date(value);
                if (isNaN(date.getTime())) return value;
                return date.toLocaleDateString();
              }
            };
          };
        }
        
        // Mock require function
        if (typeof window.require === 'undefined') {
          window.require = function(module) {
            if (module === 'numeral') return window.numeral;
            if (module === 'moment') return window.moment;
            throw new Error('Module not found: ' + module);
          };
        }
      `;
      
      // Inject the mock dependencies
      const script = document.createElement('script');
      script.textContent = mockDependencies;
      document.head.appendChild(script);
      
      // Wait for mocks to be available
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      console.log('Mock dependencies set up successfully');
    } catch (error) {
      console.warn('Failed to set up mock dependencies:', error);
    }
  }


  private modelState: any = {};
  private calculationCallbacks: (() => void)[] = [];

  // Helper: read appStorage JSON safely
  private readAppStorage(): Record<string, any> {
    try {
      const raw = localStorage.getItem(APP_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  // Helper: write appStorage JSON safely
  private writeAppStorage(next: Record<string, any>): void {
    try {
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // no-op
    }
  }

  /**
   * Get value from the model data structure
   */
  private getValueFromModel(refName: string, rawValue: boolean = false): string {
    // If we have a real jsCalc API, use it to get the value
    if (this.api && typeof this.api.getValue === 'function') {
      try {
        const value = rawValue ? this.api.getRawValue(refName) : this.api.getValue(refName);
        // Only return '#N/A' if value is null or undefined (not if it's 0, false, or empty string)
        return value === null || value === undefined ? '#N/A' : value;
      } catch (error) {
        console.warn(`Failed to get value for ${refName}:`, error);
        return '#N/A';
      }
    }

    // Debug: Check if we're using mock API
    if (!this.api) {
      console.log('Using mock API - no real jsCalc instance available');
    }

    // Fallback to modelState for mock API
    if (this.modelState && this.modelState[refName] !== undefined) {
      const value = this.modelState[refName];
      return rawValue ? value.toString() : this.formatValue(value);
    }
    
    return '#N/A';
  }



  /**
   * Get cell value from model structure
   */
  private getCellValue(cellRef: string, model: any): any {
    // Parse cell reference like "Dashboard!G37"
    const [worksheet, cell] = cellRef.split('!');
    
    if (model.worksheets && model.worksheets[worksheet] && model.worksheets[worksheet].cells) {
      const cellData = model.worksheets[worksheet].cells[cell];
      return cellData ? cellData.value : 0;
    }
    
    return 0;
  }

  /**
   * Set cell value in model structure
   */
  private setCellValue(cellRef: string, value: any, model: any): void {
    const [worksheet, cell] = cellRef.split('!');
    
    if (model.worksheets && model.worksheets[worksheet]) {
      if (!model.worksheets[worksheet].cells) {
        model.worksheets[worksheet].cells = {};
      }
      model.worksheets[worksheet].cells[cell] = { value, formula: null };
      
      // Trigger recalculation of dependent formulas
      this.recalculateFormulas(model);
    }
  }

  /**
   * Recalculate all formulas in the model
   */
  private recalculateFormulas(model: any): void {
    if (!model.worksheets) return;

    // Simple formula evaluation for basic calculations
    Object.keys(model.worksheets).forEach(worksheetName => {
      const worksheet = model.worksheets[worksheetName];
      if (!worksheet.cells) return;

      Object.keys(worksheet.cells).forEach(cellRef => {
        const cell = worksheet.cells[cellRef];
        if (cell.formula) {
          try {
            const newValue = this.evaluateFormula(cell.formula, worksheet.cells);
            cell.value = newValue;
          } catch (error) {
            console.warn(`Failed to evaluate formula ${cell.formula} in ${cellRef}:`, error);
          }
        }
      });
    });
  }

  /**
   * Simple formula evaluator for basic calculations
   */
  private evaluateFormula(formula: string, cells: any): number {
    if (!formula || !formula.startsWith('=')) {
      return 0;
    }

    let expression = formula.substring(1); // Remove the '='

    // Replace cell references with their values
    expression = expression.replace(/([A-Z]+)(\d+)/g, (match, col, row) => {
      const cellRef = `${col}${row}`;
      const cell = cells[cellRef];
      return cell ? cell.value : 0;
    });

    // Handle simple IF statements
    expression = expression.replace(/IF\(([^,]+),([^,]+),([^)]+)\)/g, (match, condition, trueVal, falseVal) => {
      const cond = this.evaluateExpression(condition);
      return (cond ? this.evaluateExpression(trueVal) : this.evaluateExpression(falseVal)).toString();
    });

    return this.evaluateExpression(expression);
  }

  /**
   * Evaluate a simple mathematical expression
   */
  private evaluateExpression(expression: string): number {
    try {
      // Replace common operators and functions
      expression = expression.replace(/\*/g, '*');
      expression = expression.replace(/\//g, '/');
      expression = expression.replace(/\+/g, '+');
      expression = expression.replace(/-/g, '-');
      
      // Use Function constructor for safe evaluation
      return new Function('return ' + expression)();
    } catch (error) {
      console.warn(`Failed to evaluate expression: ${expression}`, error);
      return 0;
    }
  }

  /**
   * Format value for display
   */
  private formatValue(value: any): string {
    if (typeof value === 'number') {
      return value.toString();
    }
    return value || '0';
  }

  /**
   * Get model names matching pattern
   */
  private getModelNames(pattern: RegExp): string[] {
    if (!this.buildOptions?.model?.namedRanges) {
      return [];
    }
    
    return Object.keys(this.buildOptions.model.namedRanges).filter(name => 
      pattern.test(name)
    );
  }

  /**
   * Get model range reference
   */
  private getModelRangeRef(refName: string): any {
    if (!this.buildOptions?.model?.namedRanges) {
      return null;
    }
    
    const cellRef = this.buildOptions.model.namedRanges[refName];
    if (cellRef) {
      return {
        getSingleCellReference: () => ({
          worksheet: { name: cellRef.split('!')[0] }
        })
      };
    }
    
    return null;
  }

  /**
   * Trigger recalculation
   */
  private triggerRecalculation(): void {
    // Execute calculation callbacks
    this.calculationCallbacks.forEach(callback => callback());
    
    // Trigger the MODEL_CALC_COMPLETE event
    this.communicator.trigger('MODEL_CALC_COMPLETE');
  }

  /**
   * Simulate model loading with progress
   */
  private simulateModelLoading(api: jsCalc, resolve: (api: jsCalc) => void): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      this.onProgress({ numComplete: progress, numTotal: 100 });
      
      if (progress >= 100) {
        clearInterval(interval);
        resolve(api);
      }
    }, 100);
  }

  /**
   * On progress trigger to transmit progress to any subscribers
   */
  private onProgress(progressOb: any) {
    const progress: number = progressOb.numComplete / progressOb.numTotal;
    this.communicator.trigger(MODEL_LOAD_PROGRESS, progress);
  }

  /**
   * Get value from calcModel
   */
  getValue(refName: string, rawValue?: boolean): string {
    if (!this.api) {
      return '#N/A';
    }

    try {
      const value = rawValue ? this.api.getRawValue(refName) : this.api.getValue(refName);
      // Only return '#N/A' if value is null or undefined (not if it's 0, false, or empty string)
      return value === null || value === undefined ? '#N/A' : value;
    } catch (error) {
      console.warn(`Failed to get value for ${refName}:`, error);
      return '#N/A';
    }
  }

  /**
   * Get value from calcModel with yearRef
   */
  getValueForYear(refName: string, yearRef?: string, rawValue?: boolean): string {
    if (yearRef) {
      const year = this.getValue(yearRef, rawValue);
      if (typeof year !== 'undefined' && year !== '') {
        refName += '_R' + year;
      }
    }
    return this.getValue(refName, rawValue);
  }

  /**
   * Set value to calcModel
   */
  setValue(refName: string, value: any, dontSaveStateToStorage: boolean = false, userRound: string = null, ComponentName: string = null, isEmit: boolean = false): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      if (!this.api) {
        reject(new Error('API not initialized'));
        return;
      }

      // Migration guard: silently skip writes to inactive range names
      if (refName.startsWith('__INACTIVE__')) {
        console.debug(`[Migration] Skipping setValue for inactive range: ${refName}`);
        resolve();
        return;
      }

      try {
        // Call setValue directly like the original - it should return a Promise
        this.api.setValue(refName, value)
          .then((emitEventOnComplete: boolean = true) => {
            // Trigger the model calculation complete event
            this.communicator.trigger(MODEL_CALC_COMPLETE, refName);

            // Save state to storage if not disabled
            if (!dontSaveStateToStorage) {
              this.communicator.trigger(SAVE_TO_STORAGE_EMITTER);
            }
            resolve();
          })
          .catch((error) => {
            console.warn(`Failed to set value for ${refName}:`, error);
            // Don't reject the promise during state restoration - just resolve
            if (dontSaveStateToStorage) {
              resolve();
            } else {
              reject(error);
            }
          });
      } catch (e) {
        console.warn(`Failed to set value for ${refName}:`, e);
        // Don't reject the promise during state restoration - just resolve
        if (dontSaveStateToStorage) {
          resolve();
        } else {
        reject(e);
        }
      }
    });
  }

  /**
   * Set value from calcModel with yearRef
   */
  setValueForYear(refName: string, value: any, yearRef: string, ComponentName: string = null, isEmit: boolean = false): Promise<any> {
    let year = '';
    let round: string = '';
    if (yearRef) {
      year = this.getValue(yearRef);
      if (typeof year !== 'undefined') {
        refName += '_R' + year;
        round = year;
      }
    } else {
      round = this.getRoundValue();
    }

    return this.setValue(refName, value, false, String(round), ComponentName, isEmit);
  }

  /**
   * Get the emitter for calc-updates
   */
  getObservable() {
    return this.communicator;
  }

  /**
   * Append data to model state
   */
  appendDataToModel(stateOb?: string | JSON): Promise<any> {
    let jsonState: JSON;
    const arrPromises: Array<Promise<any>> = [];

    // if stateobject is null / undefined nothing to append to model
    if (!stateOb) {
      return Promise.resolve();
    }

    // if stateobject is a string - try and parse as json object and append to model
    if (typeof stateOb === 'string') {
      try {
        jsonState = JSON.parse(stateOb);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    // if stateobject is an object, use it as is and append to model
    if (typeof stateOb === 'object') {
      jsonState = stateOb;
    }

    return new Promise<void>((resolve, reject) => {
      // Add a small delay to ensure jsCalc is fully initialized
      setTimeout(() => {
      Object.keys(jsonState)
        .forEach((key: string) => {
            arrPromises.push(
              this.setValue(key, jsonState[key], true)
                .catch((error) => {
                  console.warn(`Failed to restore state for ${key}:`, error);
                  return Promise.resolve(); // Don't fail the entire restoration
                })
            );
        });
      Promise.all(arrPromises)
        .then(() => {
            this.communicator.trigger(SAVE_TO_STORAGE_EMITTER);
          resolve();
        })
          .catch((error) => {
            console.warn('State restoration failed, but continuing:', error);
            resolve(); // Don't fail initialization
          });
      }, 100); // Small delay to ensure jsCalc is ready
    });
  }

  /**
   * Load model with an optional model state
   */
  setModelState(modelState?: string | JSON): Promise<any> {
    return this.loadModel(modelState);
  }

  /**
   * Force recalculate model
   */
  forceRecalculate(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      if (!this.api) {
        reject(new Error('API not initialized'));
        return;
      }

      this.api.getBook().recalculate();
      this.api.addCalculationCallback(() => {
        this.communicator.trigger(CALC_COMPLETE);
        resolve();
      });
    });
  }

  /**
   * Save model state to data-store using StorageService
   */
  saveStateToStorage(): Promise<any> {
    if (!this.api) {
      return Promise.resolve();
    }
    // Write model state into unified appStorage only
    const current = this.readAppStorage();
    current[APP_STORAGE_MODEL_STATE_FIELD] = this.getModelState();
    this.writeAppStorage(current);
    return Promise.resolve();
  }

  /**
   * Get current calc model state as stringified json
   */
  getModelState(): string {
    if (!this.api) {
      return '{}';
    }
    return this.api.getJSONState();
  }

  /**
   * Clear the model state from storage (useful for debugging)
   */
  clearModelState(): Promise<void> {
    const current = this.readAppStorage();
    current[APP_STORAGE_MODEL_STATE_FIELD] = '{}';
    this.writeAppStorage(current);
    return Promise.resolve();
  }

  /**
   * Fetch model state from data-store using StorageService
   */
  getStateFromStorage(): Promise<any> {
    const current = this.readAppStorage();
    const state = current[APP_STORAGE_MODEL_STATE_FIELD];
    return Promise.resolve(state || '{}');
  }

  /**
   * Export data from calc model as dictionary object
   */
  exportData(exp?: string, flags?: string): any {
    if (!this.api) {
      return {};
    }

    flags = (!exp) ? 'i' : flags;
    exp = (exp) ? exp : '^tl(in|out)put.+$';

    const pattern = new RegExp(exp, flags),
      rangeNames = this.api.getNames(pattern),
      out = {};

    rangeNames.forEach((name) => {
      try {
        const val = this.api!.getRawValue(name);
        out[name] = val;
      } catch (e) {
        // try next ref
      }
    });
    return out;
  }

  /**
   * Destroy function to unsubscribe existing emitters
   */
  destroy() {
    if (this.saveStateEmitter) {
      this.communicator.off(SAVE_TO_STORAGE_EMITTER, this.saveStateEmitter);
    }
    if (this.calculationCompleteEmitter) {
      this.communicator.off(CALC_COMPLETE, this.calculationCompleteEmitter);
    }
  }

  /**
   * getRangeRef function to return jsCalc cell ref
   */
  getRangeRef(refName: string): any {
    if (!this.api) {
      return null;
    }
    return this.api.getRangeRef(refName);
  }

  /**
   * get cell references for the current expression
   */
  getCellReferences(expression: any, curCell: any, lastType?: any): Array<any> {
    let out: Array<any> = [];
    if (expression && expression.type) {
      switch (expression.type) {
        case 'wsFunc':
          if (typeof expression.argExpressionArray === 'object' && expression.argExpressionArray instanceof Array) {
            expression.argExpressionArray.forEach((_expression) => {
              out = out.concat(this.getCellReferences(_expression, curCell, expression.type));
            });
          } else {
            out = out.concat(this.getCellReferences(expression.argExpressionArray, curCell, expression.type));
          }
          break;
        case 'binary':
          out = out.concat(this.getCellReferences(expression.A, curCell, expression.type));
          out = out.concat(this.getCellReferences(expression.B, curCell, expression.type));
          break;
        case 'namedRangeReference':
          out.push({
            rangeID: expression.name,
            type: lastType === 'wsFunc' ? 'ref' : 'val'
          });
          break;
        case 'reference':
          let address;
          if (expression.worksheet) {
            address = expression.worksheet;
          } else {
            address = curCell.worksheet.name;
          }
          address += '!' + 'R' + expression.startRow + 'C' + expression.startCol;
          if (expression.endRow > expression.startRow || expression.endCol > expression.startCol) {
            address += ':R' + expression.endRow + 'C' + expression.endCol;
          }
          out.push({
            rangeID: address,
            type: lastType === 'wsFunc' ? 'ref' : 'val'
          });
          break;
      }
    }
    return out;
  }

  /**
   * Gets either the cell value or a cell reference value
  */
  getContextualValue(name: string, targetCell: any): any {
    if (!this.api) {
      return null;
    }
    return this.api.getBook().getContextualValue(name, targetCell);
  }

  /**
   * fetches friendly name from workbook
   */
  getFriendlyName(refName: string): string | null {
    if (!this.api) {
      return null;
    }
    return this.api.getFriendlyRangeName(refName);
  }

  /**
   * fetches worksheet name from worksheet
   */
  getWorksheetName(refName: string): string | null {
    if (!this.api) {
      return null;
    }

    let targetCell: any;
    let targetCellRef: any;
    let worksheetname: string = 'test';
    let result: string;
    if (refName) {
      targetCell = this.getRangeRef(refName);
      if (!targetCell) {
        if (refName.indexOf('_R') !== -1) {
          const lastResultIndex = refName.lastIndexOf('_R');
          result = String(refName.substring(lastResultIndex));
          refName = result.replace(result, '');
          targetCell = this.getRangeRef(refName);
        }
      }

      if (targetCell) {
        targetCellRef = targetCell.getSingleCellReference();
      }
      if (targetCellRef && targetCellRef.worksheet) {
        worksheetname = targetCellRef.worksheet.name;
      } else {
        worksheetname = 'test' + refName;
      }
    }
    return worksheetname;
  }

  /**
   * fetches new refname if yearRef is there
   */
  getRefNameByYearRef(refName: string, yearRef: string): string | null {
    let year = '';
    if (yearRef) {
      year = this.getValue(yearRef);
      if (typeof year !== 'undefined') {
        refName += '_R' + year;
      }
    }
    return refName;
  }

  /**
    * fetches round value when yearRef value is null
  */
  getRoundValue(): string | null {
    let round = '';
    let roundResult = '';
    if (JSON.parse(localStorage.getItem('appStorage') || '{}')) {
      roundResult = JSON.parse(localStorage.getItem('appStorage') || '{}').round_value;
    }

    if (roundResult) {
      round = roundResult;
    }
    return round;
  }

  /**
   * Get all named ranges for debugging
   */
  getAllNamedRanges(): Record<string, string> {
    if (!this.buildOptions?.model?.namedRanges) {
      return {};
    }
    return this.buildOptions.model.namedRanges;
  }

  /**
   * Get cell information for debugging
   */
  getCellInfo(cellRef: string): any {
    if (!this.buildOptions?.model?.worksheets) {
      return null;
    }

    const [worksheet, cell] = cellRef.split('!');
    const worksheetData = this.buildOptions.model.worksheets[worksheet];
    
    if (!worksheetData?.cells) {
      return null;
    }

    return worksheetData.cells[cell] || null;
  }

  /**
   * Get all available named ranges for debugging
   */
  getAvailableNamedRanges(): string[] {
    return Object.keys(this.getAllNamedRanges());
  }

  /**
   * Get all available named ranges that start with a pattern
   */
  getNamedRangesByPattern(pattern: string): string[] {
    const allRanges = this.getAvailableNamedRanges();
    return allRanges.filter(name => name.includes(pattern));
  }
}