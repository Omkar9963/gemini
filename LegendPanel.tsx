
import React from 'react';
import type { LayerInfo, VisParams } from '../types';
import { LULC_PALETTE_CATEGORICAL } from '../constants';

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <span className="w-4 h-4 rounded-sm border border-gray-500" style={{ backgroundColor: color }}></span>
    <span className="text-xs">{label}</span>
  </div>
);

interface ContinuousLegendProps {
  title: string;
  visParams: VisParams;
}

const ContinuousLegend: React.FC<ContinuousLegendProps> = ({ title, visParams }) => {
  const { min = 0, max = 1, palette } = visParams;
  const steps = palette.length;
  const delta = (max - min) / steps;

  return (
    <div>
      <h4 className="text-sm font-semibold mt-2 mb-1">{title}</h4>
      {palette.map((color, i) => {
        const valueMin = min + i * delta;
        const valueMax = min + (i + 1) * delta;
        let labelText = `${valueMin.toFixed(1)} - ${valueMax.toFixed(1)}`;
        if (steps === 1) labelText = `> ${valueMin.toFixed(1)}`;
        else if (i === 0 && steps > 1) labelText = `< ${valueMax.toFixed(1)}`;
        else if (i === steps -1 && steps > 1) labelText = `> ${valueMin.toFixed(1)}`;
        
        return <LegendItem key={`${title}-${i}`} color={color} label={labelText} />;
      })}
    </div>
  );
};

interface CategoricalLegendProps {
  title: string;
  palette: { [key: string]: { color: string, name: string } } | { [key: number]: { color: string, name: string } };
}
const CategoricalLegend: React.FC<CategoricalLegendProps> = ({ title, palette }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold mt-2 mb-1">{title}</h4>
      {Object.entries(palette).slice(0, 5).map(([key, item]) => ( // Show first 5 categories for brevity
         <LegendItem key={`${title}-${key}`} color={item.color} label={item.name} />
      ))}
      {Object.keys(palette).length > 5 && <p className="text-xs text-gray-400 mt-1">...and more categories</p>}
    </div>
  );
};


interface LegendPanelProps {
  layers: LayerInfo[];
}

export const LegendPanel: React.FC<LegendPanelProps> = ({ layers }) => {
  if (layers.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-md text-gray-300">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Legend</h3>
        <p className="text-sm text-gray-400">Run analysis to see data legends.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-gray-300 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-100 mb-2">Legend</h3>
      {layers.map(layer => {
        if (layer.name.toLowerCase().includes('lulc')) { // Specific handling for LULC
          return <CategoricalLegend key={layer.name} title={layer.name} palette={LULC_PALETTE_CATEGORICAL} />;
        } else if (layer.type === 'continuous') {
          return <ContinuousLegend key={layer.name} title={layer.name} visParams={layer.visParams} />;
        } else if (layer.type === 'categorical') { // General categorical (if not LULC)
            // Simplified: just show palette colors with generic labels
            return (
                 <div>
                    <h4 className="text-sm font-semibold mt-2 mb-1">{layer.name}</h4>
                    {layer.visParams.palette.slice(0,5).map((color, idx) => (
                        <LegendItem key={`${layer.name}-${idx}`} color={color} label={layer.description ? `${layer.description} ${idx+1}` : `Category ${idx+1}`} />
                    ))}
                    {layer.visParams.palette.length > 5 && <p className="text-xs text-gray-400 mt-1">...and more</p>}
                 </div>
            );
        }
        return null; 
      })}
    </div>
  );
};
