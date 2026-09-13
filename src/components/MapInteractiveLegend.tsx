import React, { useState } from 'react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Square,
  Compass,
} from 'lucide-react';
import { MAP_LAYERS } from '../data/explorationData';

interface MapInteractiveLegendProps {
  activeLayers: Record<string, boolean>;
  onToggleLayer: (layerId: string) => void;
  onToggleAll?: (enable: boolean) => void;
  onSetPreset?: (preset: 'all' | 'geology' | 'ai' | 'minimal') => void;
  targetsCount: number;
  drillholesCount: number;
  occurrencesCount: number;
}

export const MapInteractiveLegend: React.FC<MapInteractiveLegendProps> = ({
  activeLayers,
  onToggleLayer,
  onToggleAll,
  onSetPreset,
  targetsCount,
  drillholesCount,
  occurrencesCount,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const totalLayers = MAP_LAYERS.length;
  const activeCount = MAP_LAYERS.filter((l) => activeLayers[l.id]).length;

  const renderLayerSymbol = (layerId: string, color: string) => {
    switch (layerId) {
      case 'lineaments':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-red-600"></span>
          </div>
        );
      case 'mineralization':
        return (
          <div className="w-5 h-5 flex items-center justify-center relative">
            <span className="w-3.5 h-3.5 rounded-full border border-sky-600 bg-sky-100 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
            </span>
          </div>
        );
      case 'prospectivity':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 border border-emerald-600 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            </span>
          </div>
        );
      case 'geology':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="w-4 h-3 rounded-xs border border-dashed border-amber-600 bg-amber-100"></span>
          </div>
        );
      case 'occurrences':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-stone-700 font-mono font-bold text-white text-[8px] flex items-center justify-center leading-none">
              M
            </span>
          </div>
        );
      case 'satellite':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-xs bg-cyan-100 border border-cyan-600 flex items-center justify-center">
              <span className="text-[7px] font-mono font-bold text-cyan-800">SW</span>
            </span>
          </div>
        );
      case 'terrain':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="w-3.5 h-3 rounded-xs border border-purple-400 bg-purple-100 flex flex-col justify-around p-0.5">
              <span className="w-full h-px bg-purple-600"></span>
              <span className="w-full h-px bg-purple-600"></span>
            </span>
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          </div>
        );
    }
  };

  const getLayerCountBadge = (layerId: string) => {
    switch (layerId) {
      case 'mineralization':
        return `${drillholesCount} Collars`;
      case 'occurrences':
        return `${occurrencesCount} Mines`;
      case 'prospectivity':
        return `${targetsCount} Zones`;
      default:
        return null;
    }
  };

  return (
    <div className="absolute bottom-4 left-4 z-[900] select-none max-w-[calc(100vw-32px)]">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-2 px-3.5 py-2 bg-white/95 hover:bg-white border border-stone-300 hover:border-stone-400 rounded-xl text-xs font-medium text-stone-800 shadow-md backdrop-blur-xs transition-all cursor-pointer"
          title="Expand Interactive Map Legend"
        >
          <div className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-stone-700" />
            <span className="font-semibold">Map Layers</span>
          </div>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-mono font-bold border border-stone-200">
            {activeCount}/{totalLayers}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-stone-500" />
        </button>
      ) : (
        <div className="w-80 max-w-[calc(100vw-32px)] bg-white/95 border border-stone-300 rounded-2xl shadow-xl backdrop-blur-xs text-xs font-sans overflow-hidden">
          {/* Top Title Bar */}
          <div className="bg-[#faf9f6] px-3.5 py-2.5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-700" />
              <div>
                <div className="font-semibold text-stone-900 text-xs flex items-center space-x-1.5">
                  <span>Geological GIS Layers</span>
                </div>
                <div className="text-[10px] text-stone-500">
                  Toggle overlays on map surface
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[10px] font-bold">
                {activeCount}/{totalLayers}
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                title="Collapse Legend"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preset Bar */}
          <div className="px-3.5 py-1.5 bg-[#fcfbf9] border-b border-stone-200 flex items-center justify-between text-[10px] text-stone-600">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleAll && onToggleAll(true)}
                className="hover:text-stone-900 transition-colors cursor-pointer flex items-center space-x-1 font-medium"
              >
                <CheckSquare className="w-3 h-3 text-emerald-700" />
                <span>All On</span>
              </button>
              <span className="text-stone-300">|</span>
              <button
                onClick={() => onToggleAll && onToggleAll(false)}
                className="hover:text-stone-900 transition-colors cursor-pointer flex items-center space-x-1 font-medium"
              >
                <Square className="w-3 h-3 text-stone-400" />
                <span>Clear</span>
              </button>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-stone-400">Presets:</span>
              <button
                onClick={() => onSetPreset && onSetPreset('geology')}
                className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                Geology
              </button>
              <button
                onClick={() => onSetPreset && onSetPreset('ai')}
                className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                Prospectivity
              </button>
            </div>
          </div>

          {/* Layer Items List */}
          <div className="max-h-[min(300px,45vh)] overflow-y-auto divide-y divide-stone-100 p-1">
            {MAP_LAYERS.map((layer) => {
              const isActive = !!activeLayers[layer.id];
              const countBadge = getLayerCountBadge(layer.id);

              return (
                <div
                  key={layer.id}
                  onClick={() => onToggleLayer(layer.id)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-stone-50 hover:bg-stone-100/80 text-stone-900' 
                      : 'hover:bg-stone-50 text-stone-400 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="shrink-0">
                      {renderLayerSymbol(layer.id, layer.color)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-xs ${isActive ? 'font-medium text-stone-900' : 'text-stone-500'}`}>
                          {layer.name}
                        </span>
                        {countBadge && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${
                            isActive 
                              ? 'bg-white text-stone-700 border-stone-200' 
                              : 'bg-stone-100 text-stone-500 border-stone-200'
                          }`}>
                            {countBadge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate max-w-[190px]">
                        {layer.description}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLayer(layer.id);
                    }}
                    className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? 'text-stone-700 hover:text-stone-950 hover:bg-stone-200' 
                        : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                    }`}
                    title={isActive ? 'Layer visible' : 'Layer hidden'}
                  >
                    {isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Coordinates & Source Note */}
          <div className="px-3 py-1.5 bg-[#faf9f6] border-t border-stone-200 flex items-center justify-between text-[10px] font-mono text-stone-500">
            <span className="flex items-center space-x-1">
              <Compass className="w-3 h-3 text-stone-500" />
              <span>PILOT: 21.65°N, 79.85°E</span>
            </span>
            <span className="text-[9px] text-stone-400">
              Balaghat–Nagpur Belt
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
