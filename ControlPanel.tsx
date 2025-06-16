
import React from 'react';
import type { Basin } from '../types';
import { InspectorMode } from '../types';
import { BASIN_OPTIONS } from '../constants';
import { Button } from './Button';
import { Select } from './Select';
import { Input } from './Input';

interface ControlPanelProps {
  selectedBasin: Basin | null;
  onBasinChange: (basin: Basin | null) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onRunAnalysis: () => void;
  onReset: () => void;
  isLoading: boolean;
  inspectorMode: InspectorMode;
  onInspectorModeChange: (mode: InspectorMode) => void;
  isDrawingPolygon: boolean;
  drawnPolygon: any | null;
  onStartDrawing: () => void;
  onFinalizePolygon: () => void;
  onClearDrawing: () => void;
  onAnalyzePolygon: () => void;
  analysisRan: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedBasin,
  onBasinChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onRunAnalysis,
  onReset,
  isLoading,
  inspectorMode,
  onInspectorModeChange,
  isDrawingPolygon,
  drawnPolygon,
  onStartDrawing,
  onFinalizePolygon,
  onClearDrawing,
  onAnalyzePolygon,
  analysisRan
}) => {
  const handleBasinSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const basinId = event.target.value;
    const basin = BASIN_OPTIONS.find(b => b.id === basinId) || null;
    onBasinChange(basin);
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onInspectorModeChange(event.target.value as InspectorMode);
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-gray-800 text-gray-100 p-6 space-y-6 overflow-y-auto shadow-2xl">
      <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2">Runoff Estimation Tool</h2>
      
      <div className="space-y-2">
        <label htmlFor="basin-select" className="block text-sm font-medium text-gray-300">Select Basin:</label>
        <Select
          id="basin-select"
          value={selectedBasin?.id || ''}
          onChange={handleBasinSelectChange}
          disabled={isLoading}
        >
          <option value="" disabled>Select a basin</option>
          {BASIN_OPTIONS.map(basin => (
            <option key={basin.id} value={basin.id}>{basin.name}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="start-date" className="block text-sm font-medium text-gray-300">Start Date:</label>
        <Input
          type="date"
          id="start-date"
          value={startDate}
          onChange={e => onStartDateChange(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="end-date" className="block text-sm font-medium text-gray-300">End Date:</label>
        <Input
          type="date"
          id="end-date"
          value={endDate}
          onChange={e => onEndDateChange(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-3 pt-2">
        <Button onClick={onRunAnalysis} disabled={isLoading} fullWidth variant="primary">
          {isLoading ? 'Processing...' : 'Run Analysis'}
        </Button>
        <Button onClick={onReset} disabled={isLoading} fullWidth variant="secondary">
          Reset
        </Button>
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-700">
        <label htmlFor="inspector-mode" className="block text-sm font-medium text-gray-300">Inspector Mode:</label>
        <Select
          id="inspector-mode"
          value={inspectorMode}
          onChange={handleModeChange}
          disabled={isLoading}
        >
          {Object.values(InspectorMode).map(mode => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </Select>
      </div>

      {inspectorMode === InspectorMode.Polygon && (
        <div className="space-y-3 pt-2">
           {!isDrawingPolygon && !drawnPolygon && (
            <Button onClick={onStartDrawing} disabled={isLoading || !analysisRan} fullWidth variant="outline">
              Start Drawing Polygon
            </Button>
          )}
          {isDrawingPolygon && (
            <Button onClick={onFinalizePolygon} disabled={isLoading} fullWidth variant="success">
              Finalize Polygon (Mock)
            </Button>
          )}
          {drawnPolygon && !isDrawingPolygon && (
             <Button onClick={onAnalyzePolygon} disabled={isLoading || !analysisRan} fullWidth variant="primary">
              Analyze Drawn Polygon
            </Button>
          )}
          {(isDrawingPolygon || drawnPolygon) && (
            <Button onClick={onClearDrawing} disabled={isLoading} fullWidth variant="danger_outline">
              Clear Drawn Polygon
            </Button>
          )}
          {!analysisRan && <p className="text-xs text-yellow-400 text-center">Run analysis first to enable polygon tools.</p>}
        </div>
      )}
    </aside>
  );
};
