
import React, { useState, useEffect, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { MapPlaceholder } from './components/MapPlaceholder';
import { ChartPanel } from './components/ChartPanel';
import { InspectorPanel } from './components/InspectorPanel';
import { LegendPanel } from './components/LegendPanel';
import { Loader } from './components/Loader';
import { ChatWidget } from './components/ChatWidget'; // Import ChatWidget
import { DEFAULT_START_DATE, DEFAULT_END_DATE, BASIN_OPTIONS } from './constants';
import type { Basin, AnalysisResults, PointInspectionResult, PolygonAnalysisResult, TimeSeriesDataPoint, LayerInfo } from './types';
import { InspectorMode } from './types';
import * as AnalysisService from './services/analysisService'; // Mock service
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [selectedBasin, setSelectedBasin] = useState<Basin | null>(BASIN_OPTIONS[0] || null);
  const [startDate, setStartDate] = useState<string>(DEFAULT_START_DATE);
  const [endDate, setEndDate] = useState<string>(DEFAULT_END_DATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inspectorMode, setInspectorMode] = useState<InspectorMode>(InspectorMode.Point);
  
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [chartData, setChartData] = useState<TimeSeriesDataPoint[]>([]);
  const [inspectorContent, setInspectorContent] = useState<React.ReactNode>(null);
  const [activeLayers, setActiveLayers] = useState<LayerInfo[]>([]);
  
  const [isDrawingPolygon, setIsDrawingPolygon] = useState<boolean>(false);
  const [drawnPolygon, setDrawnPolygon] = useState<any | null>(null); // Mock polygon data

  useEffect(() => {
    // Initial message for inspector panel based on mode
    if (inspectorMode === InspectorMode.Point) {
      setInspectorContent(<p className="text-sm text-gray-600">Click on the map for runoff details after running analysis.</p>);
    } else {
      setInspectorContent(<p className="text-sm text-gray-600">Use drawing tools to define an area of interest after running analysis.</p>);
    }
  }, [inspectorMode]);

  const handleRunAnalysis = useCallback(async () => {
    if (!selectedBasin || !startDate || !endDate) {
      toast.error('Please select a basin and valid dates.');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('Start date must be before end date.');
      return;
    }

    setIsLoading(true);
    setAnalysisResults(null);
    setChartData([]);
    setActiveLayers([]);
    setInspectorContent(null);
    setDrawnPolygon(null); // Clear previous polygon

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const results = await AnalysisService.performAnalysis(selectedBasin.id, startDate, endDate);
      setAnalysisResults(results);
      setChartData(results.timeSeries);
      
      const layers: LayerInfo[] = [];
      if (results.layers.lulc) layers.push(results.layers.lulc);
      if (results.layers.totalPrecipitation) layers.push(results.layers.totalPrecipitation);
      if (results.layers.totalRunoff) layers.push(results.layers.totalRunoff);
      if (results.layers.accumulatedRunoff) layers.push(results.layers.accumulatedRunoff);
      if (results.layers.watersheds) layers.push(results.layers.watersheds);
      setActiveLayers(layers);

      toast.success('Analysis complete! You can now inspect the map.');
      if (inspectorMode === InspectorMode.Point) {
        setInspectorContent(<p className="text-sm text-gray-600">Click on the map for runoff details.</p>);
      } else {
         setInspectorContent(<p className="text-sm text-gray-600">Click "Start Drawing Polygon" then "Finalize Polygon" to analyze an area.</p>);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setInspectorContent(<p className="text-sm text-red-500">Analysis failed. Check console for details.</p>);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBasin, startDate, endDate, inspectorMode]);

  const handleReset = () => {
    setSelectedBasin(BASIN_OPTIONS[0] || null);
    setStartDate(DEFAULT_START_DATE);
    setEndDate(DEFAULT_END_DATE);
    setAnalysisResults(null);
    setChartData([]);
    setActiveLayers([]);
    setInspectorContent(null);
    setIsLoading(false);
    setInspectorMode(InspectorMode.Point);
    setIsDrawingPolygon(false);
    setDrawnPolygon(null);
    toast.info('Application reset.');
  };

  const handleMapClick = useCallback(async (coords: { lat: number; lon: number }) => {
    if (inspectorMode !== InspectorMode.Point || !analysisResults || isLoading) return;

    setIsLoading(true);
    setInspectorContent(<Loader mini />);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!selectedBasin) throw new Error("Basin not selected");
      const pointData = await AnalysisService.getPointInspectionData(coords, selectedBasin.id, analysisResults);
      
      const descriptiveStyle = "text-xs text-gray-500 italic mt-1 mb-2 ml-2";
      setInspectorContent(
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-700">Point Inspection Results</h3>
          <p><strong>Coordinates:</strong> Lat: {pointData.coordinates.lat.toFixed(4)}, Lon: {pointData.coordinates.lon.toFixed(4)}</p>
          {pointData.message && <p className="text-orange-600">{pointData.message}</p>}
          <p className="text-md">💧 <strong>Runoff Generated at Point:</strong> {pointData.generatedRunoff.toFixed(2)} mm</p>
          <p className={descriptiveStyle}>Runoff from this single pixel location.</p>
          <p className="text-md font-medium text-green-700">🌊 <strong>Total Accumulated Runoff:</strong> {pointData.accumulatedRunoff.toFixed(2)} mm</p>
           <p className={descriptiveStyle}>
            {selectedBasin.id === 'PAP' && pointData.contributingWatershed 
              ? 'Sum of runoff from the entire upstream watershed.'
              : 'Weighted index of flow from upstream areas.'
            }
          </p>
        </div>
      );
      toast.success('Point inspection complete.');
    } catch (error) {
      console.error("Point inspection error:", error);
      toast.error(`Point inspection failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setInspectorContent(<p className="text-sm text-red-500">Point inspection failed.</p>);
    } finally {
      setIsLoading(false);
    }
  }, [inspectorMode, analysisResults, selectedBasin, isLoading]);

  const handlePolygonAnalysis = useCallback(async () => {
    if (inspectorMode !== InspectorMode.Polygon || !analysisResults || !drawnPolygon || isLoading) {
        if (!drawnPolygon) toast.warn("Please 'finalize' a polygon first.");
        return;
    }
    
    setIsLoading(true);
    setInspectorContent(<Loader mini />);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!selectedBasin) throw new Error("Basin not selected");
      const polygonData = await AnalysisService.getPolygonAnalysisData(drawnPolygon, selectedBasin.id, analysisResults);
      
      const descriptiveStyle = "text-xs text-gray-500 italic mt-1 mb-2 ml-2";
      setInspectorContent(
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-700">Polygon Analysis Results</h3>
          <p>📐 <strong>Polygon Area:</strong> {polygonData.areaHa.toFixed(2)} ha ({polygonData.areaSqKm.toFixed(2)} km²)</p>
          <p className="text-md">💧 <strong>Total Generated Runoff (in polygon):</strong> {polygonData.totalGeneratedRunoffMm.toLocaleString(undefined, {maximumFractionDigits:2})} mm</p>
          <p className={descriptiveStyle}>Sum of runoff depths within the drawn polygon.</p>
          <p className="text-md font-medium text-green-700">🌊 <strong>Total Accumulated Runoff:</strong> {polygonData.totalAccumulatedRunoff.toLocaleString(undefined, {maximumFractionDigits: polygonData.isPapBasin ? 2 : 0}) } {polygonData.isPapBasin ? 'mm' : ''}</p>
          <p className={descriptiveStyle}>
            {polygonData.isPapBasin 
              ? 'Sum of runoff from upstream areas contributing to the polygon.'
              : 'Weighted sum of flow accumulation within the polygon.'
            }
          </p>
        </div>
      );
      toast.success('Polygon analysis complete.');
    } catch (error) {
      console.error("Polygon analysis error:", error);
      toast.error(`Polygon analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setInspectorContent(<p className="text-sm text-red-500">Polygon analysis failed.</p>);
    } finally {
      setIsLoading(false);
    }
  }, [inspectorMode, analysisResults, drawnPolygon, selectedBasin, isLoading]);
  
  const handleStartDrawingPolygon = () => {
    if (!analysisResults) {
        toast.warn("Please run analysis first before drawing a polygon.");
        return;
    }
    setIsDrawingPolygon(true);
    setDrawnPolygon(null); // Clear previous polygon
    setInspectorContent(<p className="text-sm text-gray-600">Drawing mode active. Click 'Finalize Polygon' to define the area.</p>);
    toast.info("Polygon drawing started. Click 'Finalize Polygon'.");
  };

  const handleFinalizePolygon = () => {
    // Simulate a drawn polygon. In a real app, this would come from a map library.
    const mockPolygon = { type: "Polygon", coordinates: [[[0,0],[1,0],[1,1],[0,1],[0,0]]] }; // Example
    setDrawnPolygon(mockPolygon);
    setIsDrawingPolygon(false);
    toast.success("Polygon defined. Click 'Analyze Polygon'.");
    setInspectorContent(
        <div>
            <p className="text-sm text-gray-600">Polygon defined (mocked). Click 'Analyze Polygon'.</p>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{JSON.stringify(mockPolygon, null, 2)}</pre>
        </div>
    );
  };
  
  const handleClearDrawing = () => {
    setDrawnPolygon(null);
    setIsDrawingPolygon(false);
    if (inspectorMode === InspectorMode.Polygon) {
         setInspectorContent(<p className="text-sm text-gray-600">Drawing cleared. Click "Start Drawing Polygon" to define a new area.</p>);
    }
    toast.info("Polygon drawing cleared.");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen antialiased text-gray-800">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <ControlPanel
        selectedBasin={selectedBasin}
        onBasinChange={setSelectedBasin}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onRunAnalysis={handleRunAnalysis}
        onReset={handleReset}
        isLoading={isLoading}
        inspectorMode={inspectorMode}
        onInspectorModeChange={(mode) => {
            setInspectorMode(mode);
            setDrawnPolygon(null);
            setIsDrawingPolygon(false);
        }}
        isDrawingPolygon={isDrawingPolygon}
        drawnPolygon={drawnPolygon}
        onStartDrawing={handleStartDrawingPolygon}
        onFinalizePolygon={handleFinalizePolygon}
        onClearDrawing={handleClearDrawing}
        onAnalyzePolygon={handlePolygonAnalysis}
        analysisRan={!!analysisResults}
      />

      <main className="flex-1 flex flex-col p-4 space-y-4 overflow-auto bg-white shadow-lg md:ml-2 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-700">Runoff Estimation Dashboard</h1>
        {isLoading && !inspectorContent && <Loader />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <MapPlaceholder 
              onMapClick={handleMapClick} 
              cursor={inspectorMode === InspectorMode.Point && analysisResults ? 'crosshair' : 'default'}
              isDrawing={isDrawingPolygon}
              analysisRan={!!analysisResults}
            />
            {chartData.length > 0 && (
              <ChartPanel data={chartData} />
            )}
          </div>
          
          <div className="lg:col-span-1 flex flex-col space-y-4">
            {activeLayers.length > 0 && (
              <LegendPanel layers={activeLayers} />
            )}
            <InspectorPanel content={inspectorContent} isLoading={isLoading && !!inspectorContent} />
          </div>
        </div>
      </main>
      <ChatWidget /> {/* Add ChatWidget here */}
    </div>
  );
};

export default App;
