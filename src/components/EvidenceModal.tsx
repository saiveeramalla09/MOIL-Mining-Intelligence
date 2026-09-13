import React from 'react';
import { X, Layers, Compass } from 'lucide-react';
import { ExplorationTarget } from '../types';

interface EvidenceModalProps {
  target: ExplorationTarget | null;
  isOpen: boolean;
  onClose: () => void;
  onViewResource: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  target,
  isOpen,
  onClose,
  onViewResource,
}) => {
  if (!isOpen || !target) return null;

  const evidenceItems = [
    {
      title: 'Lithostratigraphic host rock suitability (Mansar)',
      pct: target.evidence.geological.pct,
      level: target.evidence.geological.level,
      color: 'bg-stone-800',
      description: target.evidence.geological.description,
    },
    {
      title: 'Structural proximity (Regional shear zones)',
      pct: target.evidence.structural.pct,
      level: target.evidence.structural.level,
      color: 'bg-amber-700',
      description: target.evidence.structural.description,
    },
    {
      title: 'Spectral index response (Sentinel-2 SWIR/VNIR proxy)',
      pct: target.evidence.spectral.pct,
      level: target.evidence.spectral.level,
      color: 'bg-sky-700',
      description: target.evidence.spectral.description,
    },
    {
      title: 'Proximity to established manganese occurrences',
      pct: target.evidence.occurrenceProximity.pct,
      level: target.evidence.occurrenceProximity.level,
      color: 'bg-amber-800',
      description: target.evidence.occurrenceProximity.description,
    },
    {
      title: 'Terrain geomorphology & regolith thickness (SRTM)',
      pct: target.evidence.terrainContext.pct,
      level: target.evidence.terrainContext.level,
      color: 'bg-stone-600',
      description: target.evidence.terrainContext.description,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-300 w-full max-w-2xl rounded-xs shadow-xl overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-[#faf9f6] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-stone-100 border border-stone-300 flex items-center justify-center text-amber-800">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Target Intelligence &bull; {target.code}
              </div>
              <h3 className="text-sm font-semibold text-stone-900">
                Prospectivity Evidence Decomposition &bull; {target.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-900 p-1 rounded hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs text-stone-700">
          {/* Target Banner */}
          <div className="bg-[#faf9f6] p-3 rounded-xs border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-stone-500">{target.name} ({target.sector})</div>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm font-mono font-bold text-stone-900">
                  Favorability Score: {target.score.toFixed(2)}
                </span>
                <span className="text-stone-400">&bull;</span>
                <span className="text-xs text-stone-600 font-mono">
                  Confidence: {target.confidence}%
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 border border-amber-200 text-amber-800">
              {target.prospectivity} Prospectivity
            </span>
          </div>

          {/* Scientific Disclaimer */}
          <div className="text-xs text-stone-600 bg-amber-50 border-l-2 border-amber-600 p-3 rounded-r">
            <span className="font-semibold text-amber-900">Methodological Notice: </span>
            This favorability index represents a fused spatial probability from multi-source satellite Earth observation, terrain, and regional lithostructural factors. It does NOT assert direct remote sensing of underground manganese ore.
          </div>

          {/* Horizontal Contribution Chart */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-stone-600 mb-2.5 flex items-center justify-between">
              <span>Evidence Factor Contribution</span>
              <span className="text-stone-500 font-mono text-[11px]">Normalized Weights</span>
            </div>

            <div className="space-y-2.5">
              {evidenceItems.map((item) => (
                <div key={item.title} className="bg-[#fcfbf9] p-3 rounded-xs border border-stone-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-stone-900">{item.title}</span>
                    <span className="font-mono font-bold text-stone-900">{item.pct}%</span>
                  </div>
                  
                  {/* Visual Bar */}
                  <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.pct * 2.2}%` }}
                    />
                  </div>

                  <div className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-[#faf9f6] p-3 rounded-xs border border-stone-200 text-xs">
            <span className="font-semibold text-stone-900">Recommended Geological Protocol: </span>
            <span className="text-stone-700">{target.suggestedNextStep}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-[#faf9f6] border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onViewResource();
            }}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xs flex items-center space-x-2 transition-colors cursor-pointer shadow-xs"
          >
            <Layers className="w-4 h-4 text-amber-300" />
            <span>View Resource Estimation ({target.resourceSummary.targetResourceMt} Mt)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
