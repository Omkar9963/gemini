
import React from 'react';

interface MapPlaceholderProps {
  onMapClick: (coords: { lat: number; lon: number }) => void;
  cursor: string;
  isDrawing: boolean;
  analysisRan: boolean;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ onMapClick, cursor, isDrawing, analysisRan }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!analysisRan) return;
    // Mock coordinates based on click position within the div
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width; // 0-1
    const y = (event.clientY - rect.top) / rect.height; // 0-1
    // Scale to some arbitrary lat/lon range for mock purposes
    const lat = (1 - y) * 90 - 45; // -45 to 45
    const lon = x * 180 - 90;    // -90 to 90
    onMapClick({ lat, lon });
  };

  const mapPatternStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%), 
                      linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
                      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%)`,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  };

  return (
    <div 
      className="bg-gray-700 w-full aspect-video rounded-lg shadow-md flex items-center justify-center text-gray-400 relative overflow-hidden border-2 border-gray-600"
      onClick={handleClick}
      style={{ cursor: analysisRan ? cursor : 'not-allowed' }}
      title={analysisRan ? (cursor === 'crosshair' ? "Click to inspect point" : "Map area") : "Run analysis to enable map interaction"}
    >
      <div 
        className="absolute inset-0 opacity-10" 
        style={mapPatternStyle}
      ></div> {/* Subtle pattern */}
      <div className="z-10 text-center p-4">
        <p className="text-2xl font-semibold">Map Area</p>
        {!analysisRan && <p className="text-sm mt-2">Run analysis to view data and interact.</p>}
        {analysisRan && cursor === 'crosshair' && <p className="text-sm mt-2">Click on the map to inspect a point.</p>}
        {isDrawing && <p className="text-sm mt-2 text-yellow-400">Polygon drawing mode active (mocked).</p>}
      </div>
    </div>
  );
};
