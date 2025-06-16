
import type { Basin } from './types';

export const DEFAULT_START_DATE = '2023-01-01';
export const DEFAULT_END_DATE = '2023-06-29';

export const BASIN_OPTIONS: Basin[] = [
  { id: 'PAP', name: 'PAP Basin (Special Case)' },
  { id: 'INDUS', name: 'Indus Basin' },
  { id: 'MEKONG', name: 'Mekong Basin' },
  { id: 'NILE', name: 'Nile Basin' },
];

// Palettes (simplified from GEE script or common knowledge)
// GEE's MCD12Q1 LC_Type1 has 17 classes. This is a generic example.
export const LULC_PALETTE_CATEGORICAL: { [key: number]: { color: string, name: string } } = {
  1: { color: '#1f4423', name: 'Evergreen Needleleaf Forests' },
  2: { color: '#05450a', name: 'Evergreen Broadleaf Forests' },
  3: { color: '#086a10', name: 'Deciduous Needleleaf Forests' },
  4: { color: '#54a708', name: 'Deciduous Broadleaf Forests' },
  5: { color: '#78d203', name: 'Mixed Forests' },
  6: { color: '#009900', name: 'Closed Shrublands' },
  7: { color: '#c6b044', name: 'Open Shrublands' },
  8: { color: '#dcd159', name: 'Woody Savannas' },
  9: { color: '#dade48', name: 'Savannas' },
  10: { color: '#fbff13', name: 'Grasslands' },
  11: { color: '#b6ff05', name: 'Permanent Wetlands' },
  12: { color: '#27ff87', name: 'Croplands' },
  13: { color: '#c24f44', name: 'Urban and Built-up Lands' },
  14: { color: '#a5a5a5', name: 'Cropland/Natural Vegetation Mosaics' },
  15: { color: '#ff6d4c', name: 'Permanent Snow and Ice' },
  16: { color: '#69fff8', name: 'Barren' },
  17: { color: '#0000ff', name: 'Water Bodies' },
};


// Approximating 'users/gena/packages:palettes.colorbrewer.RdYlGn[9]'
export const RAINFALL_PALETTE_RDYLGN9: string[] = [
  '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'
].reverse(); // GEE might use it one way, UI might prefer another

// Approximating 'users/gena/packages:palettes.colorbrewer.RdYlBu[9]'
export const RUNOFF_PALETTE_RDYLBU9: string[] = [
  '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'
].reverse();

export const ACCUMULATED_RUNOFF_PALETTE: string[] = ['#ffffff', '#add8e6', '#0000ff', '#00008b']; // white, lightblue, blue, darkblue

export const PAP_WATERSHED_PALETTE: string[] = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#800080']; // red, orange, yellow, green, blue, purple

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002';

// Soil groups from GEE script logic: 1, 2, 3, 4
// LULC types from GEE script logic: 1 to 17
// CN values are derived from these, the long expression won't be in frontend.
// The mock service will produce runoff data that implies these calculations occurred.
