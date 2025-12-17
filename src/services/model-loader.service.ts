// React-compatible ModelLoaderService
// Loads actual model from the configured model file
// Similar to Angular version: checks API first if connectToPulse is enabled, then falls back to build
import { MODEL_CONFIG } from '../Sim/jsRequire-Config';
import { loadConfig } from '../utils/config';

interface ModelData {
  model: any;
  customActions: any;
  modelName: string;
  log?: string;
  modelLoadedFrom?: string;
}

export class ModelLoaderService {
  modelLoadedFrom: string = 'Isomer-Build';

  constructor() {}

  /**
   * Get model data - checks API first if connectToPulse is enabled, then falls back to build
   */
  async getModel(): Promise<ModelData> {
    try {
      // Load config to check if we should try API first
      const config = await loadConfig();
      
      // If connectToPulse is enabled, try to get model from API first
      if (config.connectToPulse) {
        console.log('connectToPulse is enabled, attempting to load model from API...');
        
        const apiModel = await this.getModelData(MODEL_CONFIG.MODEL_NAME);
        
        if (apiModel) {
          // Successfully loaded from API
          const _model: ModelData = {
            model: apiModel,
            customActions: this.loadCustomActions(),
            modelName: MODEL_CONFIG.MODEL_NAME,
            log: 'Data is fetching from API.',
            modelLoadedFrom: 'Delivery Director'
          };
          
          this.modelLoadedFrom = 'Delivery Director';
          console.log('Model loaded successfully from API:', _model);
          return _model;
        } else {
          // API call failed or returned no data, fall back to build
          console.log('API model not available, falling back to build model...');
        }
      }
      
      // Load from build (require.js file)
      console.log(`Loading model from build: ${MODEL_CONFIG.MODEL_FILE_NAME}...`);
      const modelData = await this.loadActualModel();
      
      const _model: ModelData = {
        model: modelData.model,
        customActions: modelData.customActions,
        modelName: modelData.modelName || MODEL_CONFIG.MODEL_NAME,
        log: 'Data is fetching from Build.',
        modelLoadedFrom: 'Isomer-Build'
      };

      this.modelLoadedFrom = 'Isomer-Build';
      console.log('Model loaded successfully from build:', _model);
      return _model;
    } catch (error) {
      console.error('Failed to load model:', error);
      throw error;
    }
  }

  /**
   * Load the actual model from the require file
   */
  private async loadActualModel(): Promise<any> {
    try {
      // Load the actual model file directly (not the index.js)
      const modelResponse = await fetch(`/${MODEL_CONFIG.MODEL_FILE_NAME}`);
      if (!modelResponse.ok) {
        throw new Error(`Failed to fetch ${MODEL_CONFIG.MODEL_FILE_NAME}: ${modelResponse.status}`);
      }
      
      const modelContent = await modelResponse.text();
      console.log('Model file loaded, parsing...');
      
      // Parse the define function to extract the model data
      const modelData = this.parseDefineFunction(modelContent);
      
      return {
        model: modelData,
        customActions: this.loadCustomActions(),
        modelName: MODEL_CONFIG.MODEL_NAME
      };
    } catch (error) {
      console.error('Failed to load actual model:', error);
      throw new Error(`Failed to load actual model: ${error}`);
    }
  }

  /**
   * Parse the define function to extract model data
   */
  private parseDefineFunction(content: string): any {
    try {
      console.log('Parsing define function...');
      
      // The model file has format: define({...}) where {...} is a JSON object
      // We need to extract the JSON object from the define function
      // Find the start of the JSON object after define(
      const startIndex = content.indexOf('define({');
      if (startIndex === -1) {
        throw new Error('Could not find define function in model file');
      }
      
      // Find the matching closing brace for the JSON object
      let braceCount = 0;
      let jsonStart = startIndex + 7; // Skip "define("
      let jsonEnd = -1;
      
      for (let i = jsonStart; i < content.length; i++) {
        if (content[i] === '{') {
          braceCount++;
        } else if (content[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonEnd = i;
            break;
          }
        }
      }
      
      if (jsonEnd === -1) {
        throw new Error('Could not find matching closing brace in define function');
      }
      
      const jsonString = content.substring(jsonStart, jsonEnd + 1);
      console.log('Extracted JSON string, parsing...');
      
      const modelJson = JSON.parse(jsonString);
      console.log('Model JSON parsed successfully');
      
      return this.convertToModelStructure(modelJson);
    } catch (error) {
      console.error('Failed to parse model:', error);
      throw new Error(`Failed to parse model: ${error}`);
    }
  }

  /**
   * Convert the parsed JSON to our model structure
   */
  private convertToModelStructure(modelJson: any): any {
    console.log('Converting to model structure...');
    
    // Convert the namedRanges format to our expected format
    const namedRanges: Record<string, string> = {};
    
    if (modelJson.namedRanges) {
      console.log(`Found ${Object.keys(modelJson.namedRanges).length} named ranges`);
      
      Object.keys(modelJson.namedRanges).forEach(name => {
        const range = modelJson.namedRanges[name];
        
        // Validate range before processing
        if (!range || !range.worksheet) {
          console.warn(`Skipping invalid named range: ${name}`, range);
          return;
        }
        
        const cellRef = `${range.worksheet}!${this.convertToCellReference(range)}`;
        namedRanges[name] = cellRef;
      });
      
      console.log(`Processed ${Object.keys(namedRanges).length} valid named ranges`);
    }
    
    // Create worksheets structure
    const worksheets: any = {};
    
    // Extract unique worksheet names from named ranges
    const worksheetNames = new Set<string>();
    Object.values(namedRanges).forEach((cellRef: string) => {
      const worksheet = cellRef.split('!')[0];
      worksheetNames.add(worksheet);
    });
    
    // Initialize worksheets
    worksheetNames.forEach(worksheetName => {
      worksheets[worksheetName] = {
        cells: {}
      };
    });
    
    console.log('Model structure created:', {
      namedRangesCount: Object.keys(namedRanges).length,
      worksheets: Object.keys(worksheets)
    });
    
    // For now, let's try passing the original structure directly
    // and see if jsCalc can handle it
    console.log('Using original model structure instead of converted structure');
    
    return {
      name: modelJson.name || 'defaultWorkbookName',
      namedRanges: modelJson.namedRanges || {},
      worksheets: modelJson.worksheets || {},
      cells: modelJson.cells || {},
      formulas: modelJson.formulas || {}
    };
  }

  /**
   * Convert range object to cell reference
   */
  private convertToCellReference(range: any): string {
    // Validate range object
    if (!range || typeof range !== 'object') {
      console.warn('Invalid range object:', range);
      return 'A1'; // Default fallback
    }
    
    // Check if startCol and startRow exist and are valid
    if (typeof range.startCol !== 'number' || typeof range.startRow !== 'number') {
      console.warn('Invalid range properties:', { startCol: range.startCol, startRow: range.startRow });
      return 'A1'; // Default fallback
    }
    
    // Convert startRow/startCol to Excel notation (e.g., B5)
    const col = String.fromCharCode(64 + range.startCol);
    return `${col}${range.startRow}`;
  }

  /**
   * Load custom actions from TRCourseActions.js
   */
  private loadCustomActions(): any {
    try {
      // For now, return empty custom actions
      // In the future, we can load from TRCourseActions.js
      return {
        actions: {},
        handlers: {}
      };
    } catch (error) {
      console.warn('Failed to load custom actions:', error);
      return {
        actions: {},
        handlers: {}
      };
    }
  }

  /**
   * Get API model data from server
   * Returns the model if successful, null if failed or not available
   */
  async getModelData(modelName: string): Promise<any> {
    try {
      const config = await loadConfig();
      const apiResponse = await this.sendModelRequest(modelName, config);
      
      if (apiResponse) {
        // Parse the define() wrapper from API response (same format as require.js file)
        const jsDataX = apiResponse.replace('define(', '');
        const jsData = jsDataX.substr(0, jsDataX.length - 2);
        const modelJson = JSON.parse(jsData);
        
        // Convert to model structure
        return this.convertToModelStructure(modelJson);
      }
      
      return null;
    } catch (error) {
      console.log('Error in loading API model:', error);
      return null;
    }
  }

  /**
   * Send model request to API
   */
  private async sendModelRequest(modelName: string, config: any): Promise<string | null> {
    try {
      const url = `${config.apiBaseUrl}/GetModel`;
      const body = {
        modelName,
        eventTitle: config.eventTitle || ''
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include' // Include cookies for authentication
      });

      if (!response.ok) {
        console.log(`API request failed with status: ${response.status}`);
        return null;
      }

      const data = await response.text();
      return data || null;
    } catch (error) {
      console.error('Error sending model request:', error);
      return null;
    }
  }

  /**
   * Send data to backup (for future use)
   */
  sendtoBackup(qData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // This would make an API call to send data to backup
      // For now, just resolve
      resolve({ success: true });
    });
  }
}