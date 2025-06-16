
import type { Basin, AnalysisResults, PointInspectionResult, PolygonAnalysisResult, TimeSeriesDataPoint, LayerInfo } from '../types';
import { 
  BASIN_OPTIONS, 
  LULC_PALETTE_CATEGORICAL, 
  RAINFALL_PALETTE_RDYLGN9, 
  RUNOFF_PALETTE_RDYLBU9, 
  ACCUMULATED_RUNOFF_PALETTE, 
  PAP_WATERSHED_PALETTE 
} from '../constants';

// Mock function to simulate fetching basin names (already available in constants)
export const getBasinNames = async (): Promise<Basin[]> => {
  return Promise.resolve(BASIN_OPTIONS);
};

// Mock performAnalysis function
export const performAnalysis = async (basinId: string, startDateStr: string, endDateStr: string): Promise<AnalysisResults> => {
  console.log(`Mock Analysis: Basin=${basinId}, Start=${startDateStr}, End=${endDateStr}`);
  
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const timeSeries: TimeSeriesDataPoint[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    timeSeries.push({
      date: currentDate.toISOString().split('T')[0],
      precipitation: Math.random() * 10 + (currentDate.getMonth() > 4 && currentDate.getMonth() < 9 ? 5 : 0), // Basic seasonality
      runoff: Math.random() * 3 + (currentDate.getMonth() > 4 && currentDate.getMonth() < 9 ? 2 : 0),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const results: AnalysisResults = {
    layers: {
      lulc: { 
        name: 'Land Use Land Cover (2019)', 
        type: 'categorical',
        visParams: { palette: Object.values(LULC_PALETTE_CATEGORICAL).map(p => p.color) },
        description: 'LULC Type'
      },
      totalPrecipitation: { 
        name: 'Total Rainfall', 
        type: 'continuous',
        visParams: { min: 0, max: 1000, palette: RAINFALL_PALETTE_RDYLGN9 } 
      },
      totalRunoff: { 
        name: 'Total Generated Runoff', 
        type: 'continuous',
        visParams: { min: 0, max: 250, palette: RUNOFF_PALETTE_RDYLBU9 } 
      },
      accumulatedRunoff: { 
        name: 'Accumulated Runoff', 
        type: 'continuous',
        visParams: { min: 0, max: 50000, palette: ACCUMULATED_RUNOFF_PALETTE } 
      },
    },
    timeSeries: timeSeries,
    rawRunoffImage: { mock: 'total_runoff_data_placeholder' },
    rawAccumulatedRunoffImage: { mock: 'accumulated_runoff_data_placeholder' },
    rawFlowAccImage: { mock: 'flow_accumulation_placeholder' },
  };

  if (basinId === 'PAP') {
    results.layers.watersheds = { 
      name: 'Watersheds (for PAP)', 
      type: 'categorical', // or vector if displaying outlines
      visParams: { palette: PAP_WATERSHED_PALETTE },
      description: 'Watershed ID'
    };
    results.rawWatershedsImage = { mock: 'pap_watersheds_data_placeholder' };
  }

  return Promise.resolve(results);
};

// Mock getPointInspectionData function
export const getPointInspectionData = async (
  coords: { lat: number; lon: number },
  basinId: string,
  analysisData: AnalysisResults | null // analysisData would be used in a real scenario
): Promise<PointInspectionResult> => {
  console.log(`Mock Point Inspection: Coords=${JSON.stringify(coords)}, Basin=${basinId}`);
  if (!analysisData) throw new Error("Analysis data not available for inspection.");

  let generatedRunoff = Math.random() * 50; // mm
  let accumulatedRunoff = generatedRunoff + Math.random() * 5000;
  let message: string | undefined = undefined;
  let contributingWatershed: any | undefined = undefined;

  if (basinId === 'PAP') {
    // Simulate finding a watershed or not for PAP
    if (Math.random() > 0.3) { // 70% chance of finding watershed
      accumulatedRunoff = Math.random() * 10000 + 500; // Larger for watershed sum
      contributingWatershed = { id: Math.floor(Math.random() * 100) + 1, mockGeometry: 'geojson_placeholder_watershed' };
       message = `Point within watershed ID ${contributingWatershed.id}.`;
    } else {
      message = 'No upstream watershed found at this point for PAP basin. Value is for point only.';
      accumulatedRunoff = generatedRunoff; // Only point value if no watershed
    }
  } else {
    // Standard basin logic
    accumulatedRunoff = Math.random() * 20000 + generatedRunoff; // Weighted index
  }
  
  // Simulate if point is outside AOI (very simplified)
  if (coords.lat > 40 || coords.lat < -40 || coords.lon > 80 || coords.lon < -80) {
      return Promise.reject(new Error("Clicked point is outside the mock selected basin."));
  }


  return Promise.resolve({
    coordinates: coords,
    generatedRunoff: generatedRunoff,
    accumulatedRunoff: accumulatedRunoff,
    message: message,
    contributingWatershed: contributingWatershed,
  });
};

// Mock getPolygonAnalysisData function
export const getPolygonAnalysisData = async (
  polygonGeo: any, // Mock polygon geometry
  basinId: string,
  analysisData: AnalysisResults | null // analysisData would be used in a real scenario
): Promise<PolygonAnalysisResult> => {
  console.log(`Mock Polygon Analysis: Basin=${basinId}, Polygon=${JSON.stringify(polygonGeo)}`);
  if (!analysisData) throw new Error("Analysis data not available for polygon analysis.");

  const areaSqM = Math.random() * 1000000 + 500000; // 0.5 to 1.5 million sq meters
  const areaHa = areaSqM / 10000;
  const areaSqKm = areaSqM / 1e6;

  // Simulate GEE's genResults.runoff_sum (total generated depth in mm over polygon)
  // This is a sum of depths, not a volume.
  const totalGeneratedRunoffMm = Math.random() * 5000 + 1000; 

  let totalAccumulatedRunoff: number;
  let contributingWatersheds: any | undefined = undefined;

  if (basinId === 'PAP') {
    // For PAP, accResult is sum of runoff from upstream area (in mm)
    totalAccumulatedRunoff = Math.random() * 20000 + totalGeneratedRunoffMm;
    contributingWatersheds = { ids: [1,2,3], mockGeometry: 'geojson_placeholder_multiwatershed' };
  } else {
    // For other basins, accResult is sum of weighted flow accumulation index (unitless or large numbers)
    totalAccumulatedRunoff = Math.random() * 5000000 + 100000;
  }

  return Promise.resolve({
    areaHa: areaHa,
    areaSqKm: areaSqKm,
    totalGeneratedRunoffMm: totalGeneratedRunoffMm,
    totalAccumulatedRunoff: totalAccumulatedRunoff,
    isPapBasin: basinId === 'PAP',
    contributingWatersheds: contributingWatersheds,
  });
};
