
export interface Basin {
  id: string;
  name: string;
}

export enum InspectorMode {
  Point = 'Inspect by Point',
  Polygon = 'Analyze by Polygon',
}

export interface VisParams {
  min?: number;
  max?: number;
  palette: string[];
  bands?: string[]; // Optional: if a layer has specific bands to display
}

export interface LayerInfo {
  name: string;
  type: 'categorical' | 'continuous' | 'vector'; // Helps in legend rendering
  visParams: VisParams;
  description?: string; // e.g., for LULC categories
}

export interface TimeSeriesDataPoint {
  date: string;
  precipitation: number;
  runoff: number;
}

export interface AnalysisResults {
  layers: {
    lulc?: LayerInfo;
    totalPrecipitation?: LayerInfo;
    totalRunoff?: LayerInfo;
    accumulatedRunoff?: LayerInfo;
    watersheds?: LayerInfo; // Special for PAP basin
  };
  timeSeries: TimeSeriesDataPoint[];
  // These would hold mock representations of GEE Image objects in a real GEE-connected app
  // For this mock version, their direct use is limited but conceptually they exist.
  rawRunoffImage?: any; 
  rawAccumulatedRunoffImage?: any;
  rawFlowAccImage?: any;
  rawWatershedsImage?: any; 
}

export interface PointInspectionResult {
  coordinates: { lat: number; lon: number };
  generatedRunoff: number;
  accumulatedRunoff: number;
  message?: string;
  contributingWatershed?: any; // Mock geometry for PAP basin's highlighted watershed
}

export interface PolygonAnalysisResult {
  areaHa: number;
  areaSqKm: number;
  totalGeneratedRunoffMm: number;
  totalAccumulatedRunoff: number; // Could be mm for PAP, or unitless index for others
  isPapBasin: boolean;
  contributingWatersheds?: any; // Mock geometry for PAP basin's highlighted watersheds
}

// For Gemini Service (example, can be expanded)
export interface GeminiResponse {
  text: string;
  // Potentially other fields depending on usage
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'gemini';
  timestamp: Date;
}
