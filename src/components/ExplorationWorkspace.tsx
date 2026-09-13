import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  Compass, 
  Box, 
  HelpCircle, 
  Eye, 
  ArrowRight, 
  Filter, 
  ChevronRight,
  SplitSquareVertical,
  Info,
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import { ExplorationTarget, Drillhole } from '../types';
import { MAP_LAYERS } from '../data/explorationData';
import { ExplorationMap2D } from './ExplorationMap2D';
import { Exploration3DViewer } from './Exploration3DViewer';
import { EvidenceModal } from './EvidenceModal';
import { CrossSectionModal } from './CrossSectionModal';

interface ExplorationWorkspaceProps {
  targets: ExplorationTarget[];
  selectedTarget: ExplorationTarget;
  onSelectTarget: (t: ExplorationTarget) => void;
  drillholes: Drillhole[];
  onNavigateToResource: (targetId: string) => void;
}

export const ExplorationWorkspace: React.FC<ExplorationWorkspaceProps> = ({
  targets,
  selectedTarget,
  onSelectTarget,
  drillholes,
  onNavigateToResource,
}) => {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [rankingFilter, setRankingFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [layerStates, setLayerStates] = useState<Record<string, boolean>>({
    prospectivity: true,
    mineralization: true,
    lineaments: true,
    geology: true,
    occurrences: true,
    satellite: true,
    terrain: false,
    geomorphology: false,
    confidence: false,
  });

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isCrossSectionModalOpen, setIsCrossSectionModalOpen] = useState(false);
  const [isExpandedMap, setIsExpandedMap] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const layerPanelRef = useRef<HTMLDivElement>(null);

  // Close layer dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (layerPanelRef.current && !layerPanelRef.current.contains(event.target as Node)) {
        setShowLayerPanel(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowLayerPanel(false);
      }
    };
    if (showLayerPanel) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLayerPanel]);

  const toggleLayer = (layerId: string) => {
    setLayerStates((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  const toggleAllLayers = (enable: boolean) => {
    const next: Record<string, boolean> = {};
    MAP_LAYERS.forEach((layer) => {
      next[layer.id] = enable;
    });
    setLayerStates(next);
  };

  const setLayerPreset = (preset: 'all' | 'geology' | 'ai' | 'minimal') => {
    const next: Record<string, boolean> = {};
    MAP_LAYERS.forEach((layer) => {
      if (preset === 'all') {
        next[layer.id] = true;
      } else if (preset === 'geology') {
        next[layer.id] = ['geology', 'lineaments', 'mineralization', 'occurrences'].includes(layer.id);
      } else if (preset === 'ai') {
        next[layer.id] = ['prospectivity', 'confidence', 'mineralization'].includes(layer.id);
      } else {
        next[layer.id] = ['prospectivity', 'mineralization'].includes(layer.id);
      }
    });
    setLayerStates(next);
  };

  const filteredTargets = targets.filter((t) => {
    if (rankingFilter === 'ALL') return true;
    return t.prospectivity === rankingFilter;
  });

  const activeLayerCount = Object.values(layerStates).filter(Boolean).length;

  return (
    <div className="space-y-4 select-none">
      {/* Top Geological Command Bar */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-stone-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-900">
            <Compass className="w-4 h-4 text-amber-700" />
            <span>01 EXPLORATION INTELLIGENCE</span>
          </div>
          <span className="text-stone-300 hidden sm:inline">|</span>
          <div className="text-xs text-stone-500 hidden sm:inline">
            Spatial Evidence Fusion &bull; Sausar Manganese Belt Corridor
          </div>
        </div>

        {/* View Controls & Action Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 2D / 3D Mode Toggle */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('2D')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === '2D'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-stone-700" />
              <span>2D GIS Map</span>
            </button>
            <button
              onClick={() => setViewMode('3D')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === '3D'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-stone-700" />
              <span>3D Subsurface</span>
            </button>
          </div>

          {/* Expand / Maximize Map Toggle */}
          <button
            onClick={() => setIsExpandedMap(!isExpandedMap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1.5 cursor-pointer ${
              isExpandedMap
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
            }`}
            title={isExpandedMap ? 'Restore standard side-by-side view' : 'Maximize map canvas across full width'}
          >
            <span>{isExpandedMap ? 'Standard (8/4)' : 'Full Width (12/12)'}</span>
          </button>

          {/* Quick Thematic Layers Dropdown Button */}
          <div className="relative" ref={layerPanelRef}>
            <button
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1.5 cursor-pointer ${
                showLayerPanel
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-stone-600" />
              <span>Layers ({activeLayerCount})</span>
            </button>

            {/* Floating Quick Layer Selector Dropdown */}
            {showLayerPanel && (
              <div 
                className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-32px)] bg-white border border-stone-300 rounded-2xl shadow-2xl p-3.5 z-[100] text-stone-800 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-200 text-xs">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Thematic GIS Overlays</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="space-x-1 text-stone-500 text-[11px]">
                      <button 
                        onClick={() => toggleAllLayers(true)} 
                        className="hover:text-stone-900 cursor-pointer font-semibold underline text-[11px]"
                      >
                        All
                      </button>
                      <span>|</span>
                      <button 
                        onClick={() => toggleAllLayers(false)} 
                        className="hover:text-stone-900 cursor-pointer font-semibold underline text-[11px]"
                      >
                        None
                      </button>
                    </div>
                    <button
                      onClick={() => setShowLayerPanel(false)}
                      className="p-1 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 max-h-[min(380px,55vh)] overflow-y-auto pr-1">
                  {MAP_LAYERS.map((layer) => {
                    const isActive = !!layerStates[layer.id];
                    return (
                      <label 
                        key={layer.id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-100/80 cursor-pointer text-xs transition-colors"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <input 
                            type="checkbox"
                            checked={isActive}
                            onChange={() => toggleLayer(layer.id)}
                            className="accent-stone-800 rounded-md cursor-pointer w-3.5 h-3.5 shrink-0"
                          />
                          <span className={`text-xs truncate ${isActive ? 'text-stone-900 font-semibold' : 'text-stone-500'}`}>
                            {layer.name}
                          </span>
                        </div>
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-stone-300" 
                          style={{ backgroundColor: layer.color }} 
                        />
                      </label>
                    );
                  })}
                </div>

                <div className="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-medium text-stone-400">Presets:</span>
                  <div className="space-x-1.5">
                    <button 
                      onClick={() => setLayerPreset('geology')}
                      className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer font-medium transition-colors"
                    >
                      Geology
                    </button>
                    <button 
                      onClick={() => setLayerPreset('ai')}
                      className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer font-medium transition-colors"
                    >
                      Prospectivity
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Direct Proceed to Resource Estimation */}
          <button
            onClick={() => onNavigateToResource(selectedTarget.id)}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span>Estimate Tonnage</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Target Quick-Switcher Command Strip */}
      <div className="bg-white px-4 py-2.5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-stone-500 uppercase text-[11px] font-semibold tracking-wide">Filter:</span>
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRankingFilter(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                rankingFilter === lvl
                  ? 'bg-stone-900 text-white font-semibold border-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 border-transparent hover:bg-stone-100'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Target Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          {filteredTargets.map((t) => {
            const isSelected = t.id === selectedTarget.id;
            const isHigh = t.prospectivity === 'HIGH';
            const dotColor = isHigh ? 'bg-emerald-600' : t.prospectivity === 'MEDIUM' ? 'bg-amber-600' : 'bg-stone-400';

            return (
              <button
                key={t.id}
                onClick={() => onSelectTarget(t)}
                className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs font-bold'
                    : 'bg-[#faf9f6] text-stone-600 hover:text-stone-900 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                <span className="font-mono">{t.code}</span>
                <span className={`text-[11px] font-mono font-normal ${isSelected ? 'text-amber-300' : 'text-stone-500'}`}>
                  {t.score.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Command Deck Layout: Map (8 or 12 cols) + Target Intelligence (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* MAP COMMAND DECK (8 Cols or 12 Cols when expanded) */}
        <div className={`${isExpandedMap ? 'lg:col-span-12' : 'lg:col-span-8'} transition-all duration-200`}>
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden relative isolate">
            {/* Top Telemetry Header Strip */}
            <div className="px-4 py-2.5 bg-[#faf9f6] border-b border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-stone-800">Target:</span>
                <span className="font-mono font-bold text-stone-900">[{selectedTarget.code}] {selectedTarget.name}</span>
                <span className="text-stone-300 hidden md:inline">&bull;</span>
                <span className="text-stone-500 font-mono hidden md:inline">
                  {selectedTarget.coordinates[0].toFixed(3)}°N, {selectedTarget.coordinates[1].toFixed(3)}°E
                </span>
              </div>

              <div className="flex items-center space-x-3 text-[11px] text-stone-500 font-mono">
                <span>DATUM: WGS84</span>
                <span className="text-stone-300">•</span>
                <span>SENSOR: SENTINEL-2 (10m)</span>
              </div>
            </div>

            {/* Viewport Canvas (2D GIS or 3D Subsurface) */}
            <div className="relative">
              {viewMode === '2D' ? (
                <ExplorationMap2D
                  targets={targets}
                  selectedTarget={selectedTarget}
                  onSelectTarget={onSelectTarget}
                  activeLayers={layerStates}
                  onToggleLayer={toggleLayer}
                  onToggleAll={toggleAllLayers}
                  onSetPreset={setLayerPreset}
                  drillholes={drillholes}
                />
              ) : (
                <Exploration3DViewer
                  target={selectedTarget}
                  targets={targets}
                  onSelectTarget={onSelectTarget}
                  drillholes={drillholes}
                  onViewResource={() => onNavigateToResource(selectedTarget.id)}
                />
              )}
            </div>
          </div>
        </div>

        {/* TARGET INTELLIGENCE PANEL (4 Cols, or 12 Cols below if expanded) */}
        <div className={`${isExpandedMap ? 'lg:col-span-12' : 'lg:col-span-4'} space-y-3`}>
          <div className="bg-white p-4.5 rounded-2xl border border-stone-200/90 shadow-sm space-y-3.5">
            {/* Target Header Dossier */}
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Target Intelligence
                </span>
                <h3 className="text-lg font-bold text-stone-900 font-mono mt-0.5">{selectedTarget.code}</h3>
                <p className="text-xs text-stone-600">{selectedTarget.name}</p>
                <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                  Coords: {selectedTarget.coordinates[0].toFixed(3)}°N, {selectedTarget.coordinates[1].toFixed(3)}°E
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  selectedTarget.prospectivity === 'HIGH'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : selectedTarget.prospectivity === 'MEDIUM'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {selectedTarget.prospectivity}
              </span>
            </div>

            {/* Score & Multi-Source Confidence HUD */}
            <div className="grid grid-cols-2 gap-2.5 bg-[#fcfbf9] p-3 rounded-xl border border-stone-200">
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wide block font-medium">Favorability Index</span>
                <span className="text-xl font-bold font-mono text-emerald-700">{selectedTarget.score.toFixed(2)}</span>
                <span className="text-[10px] text-stone-400 block mt-0.5 font-sans">Normalized 0.00 – 1.00</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wide block font-medium">Confidence</span>
                <span className="text-xl font-bold font-mono text-amber-700">{selectedTarget.confidence}%</span>
                <span className="text-[10px] text-stone-400 block mt-0.5 font-sans">Multi-layer Support</span>
              </div>
            </div>

            {/* Geological Precision Parameters */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-stone-100 text-xs">
                <span className="text-stone-500">Host Stratigraphy:</span>
                <span className="text-stone-800 font-medium">Sausar Mansar / Chorbaoli</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100 text-xs">
                <span className="text-stone-500">Fault / Shear Offset:</span>
                <span className="text-stone-800 font-mono">{selectedTarget.evidence.structural.distM}m to axial trace</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100 text-xs">
                <span className="text-stone-500">Spectral SWIR Ratio:</span>
                <span className="text-stone-800 font-mono font-medium">B11/B12: {selectedTarget.evidence.spectral.ratio}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100 text-xs">
                <span className="text-stone-500">Drillhole Data:</span>
                <span className="text-stone-800 font-mono font-medium">
                  {drillholes.filter((dh) => dh.targetId === selectedTarget.id).length} collars logged
                </span>
              </div>
              <div className="flex items-center justify-between py-1 text-xs">
                <span className="text-stone-500">Resource Target:</span>
                <span className="text-stone-900 font-mono font-bold">
                  {selectedTarget.resourceSummary.targetResourceMt} Mt @ {selectedTarget.resourceSummary.inferredGradeMn}% Mn
                </span>
              </div>
            </div>

            {/* Multi-Evidence Breakdown Compatibility List */}
            <div className="space-y-1.5 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 uppercase tracking-wide pb-1">
                <span>Evidence Layer</span>
                <span>Weight</span>
              </div>

              {[
                { label: 'Geological Horizon Compatibility', item: selectedTarget.evidence.geological },
                { label: 'Structural Shear Lineaments', item: selectedTarget.evidence.structural },
                { label: 'Satellite Multi-Spectral Anomaly', item: selectedTarget.evidence.spectral },
                { label: 'Historical Mine Proximity', item: selectedTarget.evidence.occurrenceProximity },
                { label: 'Topographic DEM Slope Context', item: selectedTarget.evidence.terrainContext },
              ].map(({ label, item }) => (
                <div key={label} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-stone-700 text-xs truncate max-w-[210px]">{label}</span>
                  <span
                    className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.level === 'HIGH'
                        ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                        : item.level === 'MEDIUM'
                        ? 'text-amber-800 bg-amber-50 border border-amber-200'
                        : 'text-stone-600 bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {item.level} ({item.pct}%)
                  </span>
                </div>
              ))}
            </div>

            {/* Inspect Evidence Button */}
            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="w-full py-2 bg-[#fcfbf9] hover:bg-stone-100 text-stone-800 text-xs font-medium rounded-xl border border-stone-300 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-600" />
              <span>Inspect Evidence Breakdown</span>
            </button>

            {/* Suggested Next Exploration Step */}
            <div className="bg-[#fcfbf9] p-3 rounded-xl border border-stone-200 text-xs">
              <span className="text-[11px] font-semibold text-stone-600 uppercase block mb-0.5">Recommended Field Protocol</span>
              <p className="text-stone-700 text-xs leading-relaxed">{selectedTarget.suggestedNextStep}</p>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onNavigateToResource(selectedTarget.id)}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Estimate Target Tonnage ({selectedTarget.resourceSummary.targetResourceMt} Mt)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCrossSectionModalOpen(true)}
                className="w-full py-2 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium rounded-xl border border-stone-300 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <SplitSquareVertical className="w-3.5 h-3.5 text-stone-500" />
                <span>Cross-Section Schematic</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EvidenceModal
        target={selectedTarget}
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onViewResource={() => onNavigateToResource(selectedTarget.id)}
      />

      <CrossSectionModal
        target={selectedTarget}
        drillholes={drillholes}
        isOpen={isCrossSectionModalOpen}
        onClose={() => setIsCrossSectionModalOpen(false)}
        onView3D={() => setViewMode('3D')}
      />
    </div>
  );
};
