import React, { useState } from 'react';
import { 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert, 
  TrendingUp, 
  Compass, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { ExplorationTarget } from '../types';
import { TARGET_RESOURCE_MODELS } from '../data/resourceData';
import { ResourceHowItWorksModal } from './ResourceHowItWorksModal';

interface ResourceWorkspaceProps {
  targets: ExplorationTarget[];
  selectedTarget: ExplorationTarget;
  onSelectTarget: (target: ExplorationTarget) => void;
  onNavigateToProduction: () => void;
  onNavigateToExploration: () => void;
}

export const ResourceWorkspace: React.FC<ResourceWorkspaceProps> = ({
  targets,
  selectedTarget,
  onSelectTarget,
  onNavigateToProduction,
  onNavigateToExploration,
}) => {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const modelData = TARGET_RESOURCE_MODELS[selectedTarget.id] || TARGET_RESOURCE_MODELS['T-07'];

  return (
    <div className="space-y-3.5 select-none">
      {/* Top Command Bar */}
      <div className="bg-white px-4 py-3 rounded-xs border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-900">
            <Layers className="w-4 h-4 text-amber-700" />
            <span>02 RESOURCE ESTIMATION</span>
          </div>
          <span className="text-stone-300 hidden sm:inline">|</span>
          <div className="text-xs text-stone-500 hidden sm:inline">
            Uncertainty-Bounded Tonnage & Grade Model &bull; Sausar Metasedimentary Belt
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium rounded-xs border border-stone-300 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>Geostat Methodology</span>
          </button>

          <button
            onClick={onNavigateToProduction}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Proceed to Production Forecast</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Target Selector Bar */}
      <div className="bg-white px-4 py-2 rounded-xs border border-stone-200 shadow-xs flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="text-xs text-stone-500 uppercase font-semibold mr-1 shrink-0">Select Prospect:</span>
        {targets.map((t) => {
          const isSelected = t.id === selectedTarget.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTarget(t)}
              className={`px-3 py-1 rounded-xs text-xs font-medium transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 font-semibold shadow-xs'
                  : 'bg-[#faf9f6] text-stone-600 hover:text-stone-900 hover:bg-stone-100 border-stone-200'
              }`}
            >
              <span className="font-mono">{t.code}</span> &bull; {t.resourceSummary.targetResourceMt} Mt @ {t.resourceSummary.gradeMnPct}% Mn
            </button>
          );
        })}
      </div>

      {/* Primary KPI Display Cards - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Estimated Geological Target */}
        <div className="bg-white p-4 rounded-xs border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium mb-1">
            Estimated Target Tonnage
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-stone-900">
              {selectedTarget.resourceSummary.targetResourceMt}
            </span>
            <span className="text-xs text-stone-500 font-medium">Mt Ore (P50)</span>
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-1.5 flex items-center space-x-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 w-fit">
            <ShieldAlert className="w-3 h-3 text-amber-700 shrink-0" />
            <span>Exploration Target &bull; Non-Certified</span>
          </div>
        </div>

        {/* Estimated Mn Grade */}
        <div className="bg-white p-4 rounded-xs border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium mb-1">
            In-Situ Mn Mean Grade
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-amber-800">
              {selectedTarget.resourceSummary.gradeMnPct}%
            </span>
            <span className="text-xs text-stone-500 font-medium">Mn Average</span>
          </div>
          <div className="text-[11px] text-stone-500 font-sans mt-1.5">
            Fe Grade: ~{modelData.gradeFePct}% | Mn/Fe Ratio: {(selectedTarget.resourceSummary.gradeMnPct / modelData.gradeFePct).toFixed(1)}:1
          </div>
        </div>

        {/* Likely Tonnage Range (Uncertainty Interval) */}
        <div className="bg-white p-4 rounded-xs border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium mb-1">
            Confidence Range (P90 – P10)
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-stone-900">
              {selectedTarget.resourceSummary.likelyRangeMt[0]}–{selectedTarget.resourceSummary.likelyRangeMt[1]}
            </span>
            <span className="text-xs text-stone-500 font-medium">Mt</span>
          </div>
          <div className="text-[11px] text-stone-500 font-sans mt-1.5">
            Spread: &plusmn;{(selectedTarget.resourceSummary.likelyRangeMt[1] - selectedTarget.resourceSummary.targetResourceMt).toFixed(1)} Mt uncertainty envelope
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="bg-white p-4 rounded-xs border border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-medium mb-1">
            Data Confidence
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-xs">
              {selectedTarget.resourceSummary.confidence} Confidence
            </span>
          </div>
          <div className="text-[11px] text-stone-500 font-sans mt-1.5">
            Interpolated across {selectedTarget.resourceSummary.drillCoverageHoles} drillholes
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column: Uncertainty Distribution & Limiting Factors (7 Cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Uncertainty Range Visualizer */}
          <div className="bg-white p-4 rounded-xs border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                Tonnage Probability Envelope
              </span>
              <span className="text-xs text-stone-500 font-sans">P90 (Conservative) &rarr; P10 (Upside)</span>
            </div>

            {/* Visual Probability Distribution Bar */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600">P90 Proven Lower Envelope:</span>
                <span className="font-bold font-mono text-stone-900">{modelData.p90TonnageMt} Mt</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-800 font-medium">P50 Expected Mean Target:</span>
                <span className="font-bold font-mono text-amber-800">{modelData.p50TonnageMt} Mt</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600">P10 Speculative Upside Ceiling:</span>
                <span className="font-bold font-mono text-stone-900">{modelData.p10TonnageMt} Mt</span>
              </div>

              {/* Graphical Scale */}
              <div className="relative pt-6 pb-2">
                <div className="w-full h-3 bg-stone-100 rounded-xs border border-stone-300 relative overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-stone-400 via-amber-500 to-emerald-600 opacity-80"
                    style={{
                      left: '20%',
                      width: '65%',
                    }}
                  />
                </div>
                {/* Pointer markers */}
                <div className="absolute top-0.5 left-[20%] -translate-x-1/2 text-[10px] font-mono text-stone-600 font-medium">
                  P90: {modelData.p90TonnageMt}M
                </div>
                <div className="absolute top-0.5 left-[52%] -translate-x-1/2 text-[10px] font-mono text-amber-800 font-bold">
                  P50: {modelData.p50TonnageMt}M
                </div>
                <div className="absolute top-0.5 left-[85%] -translate-x-1/2 text-[10px] font-mono text-emerald-800 font-medium">
                  P10: {modelData.p10TonnageMt}M
                </div>
              </div>
            </div>

            {/* Limiting Factors Section */}
            <div className="bg-[#fcfbf9] p-3.5 rounded-xs border border-stone-200 mt-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-stone-800 uppercase mb-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Primary Limiting Bottleneck in Current Dataset</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed mb-3">
                {selectedTarget.resourceSummary.limitingFactor}.
              </p>

              <div className="space-y-2">
                {modelData.uncertaintyBreakdown.map((item) => (
                  <div key={item.source} className="bg-white p-2.5 rounded-xs border border-stone-200 text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-stone-800">{item.source}</span>
                      <span className="font-mono font-semibold text-amber-800 text-[11px]">Impact: {item.impactPct}%</span>
                    </div>
                    <div className="text-[11px] text-stone-600">
                      <span className="text-stone-500 font-medium">Mitigation: </span>
                      {item.mitigation}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended Next Information */}
              <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-500">Recommended Protocol:</span>
                <span className="font-medium text-emerald-800">{selectedTarget.suggestedNextStep}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Physical & Block Model Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="bg-white p-4 rounded-xs border border-stone-200 shadow-xs">
            <div className="text-xs font-semibold text-stone-900 uppercase tracking-wide mb-3 pb-2 border-b border-stone-200">
              Geometrical & Physical Parameters
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#fcfbf9] rounded-xs border border-stone-200">
                <span className="text-stone-600">Estimated Block Volume:</span>
                <span className="font-mono font-bold text-stone-900">
                  {selectedTarget.resourceSummary.blockVolumeM3.toLocaleString()} m³
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#fcfbf9] rounded-xs border border-stone-200">
                <span className="text-stone-600">In-Situ Bulk Density:</span>
                <span className="font-mono font-bold text-stone-900">
                  {selectedTarget.resourceSummary.bulkDensityTpm3.toFixed(2)} t/m³
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#fcfbf9] rounded-xs border border-stone-200">
                <span className="text-stone-600">Unit Cell Dimensions:</span>
                <span className="font-mono text-stone-800">
                  {modelData.unitBlockSizeM.join('m × ')}m
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#fcfbf9] rounded-xs border border-stone-200">
                <span className="text-stone-600">Modelled Blocks:</span>
                <span className="font-mono text-stone-800">{modelData.blockCount.toLocaleString()} blocks</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#fcfbf9] rounded-xs border border-stone-200">
                <span className="text-stone-600">Drillhole Data:</span>
                <span className="font-mono font-bold text-amber-800">
                  {selectedTarget.resourceSummary.drillCoverageHoles} boreholes
                </span>
              </div>

              <div className="p-2.5 bg-[#fcfbf9] rounded-xs border border-stone-200 text-xs text-stone-600">
                <span className="font-semibold text-stone-800 uppercase block mb-0.5 text-[11px]">Spatial Continuity Diagnostic</span>
                {selectedTarget.resourceSummary.dataDensityNotes}
              </div>
            </div>

            {/* Geostatistical Kriging Comparison Box */}
            <div className="mt-3 p-3 bg-[#faf9f6] rounded-xs border border-stone-200">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-2">
                <span>Model Benchmark Comparison</span>
                <span className="text-emerald-700 font-mono text-xs">R² = {modelData.krigingComparison.crossValidationR2}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xs border border-stone-200">
                  <div className="text-[11px] text-stone-500">Ordinary Kriging</div>
                  <div className="text-stone-900 font-bold font-mono">{modelData.krigingComparison.ordinaryKrigingMt} Mt</div>
                </div>
                <div className="bg-white p-2 rounded-xs border border-stone-200">
                  <div className="text-[11px] text-emerald-700">ML Regressor</div>
                  <div className="text-emerald-800 font-bold font-mono">{modelData.krigingComparison.mlEnsembleMt} Mt</div>
                </div>
              </div>
              <div className="text-[11px] text-stone-500 font-mono mt-1.5">
                Variance Reduction: {modelData.krigingComparison.varianceReductionPct}% over univariate interpolation
              </div>
            </div>

            {/* Quick Navigation Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={onNavigateToProduction}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
              >
                <TrendingUp className="w-4 h-4 text-amber-300" />
                <span>Project Production Impact & Shortfall</span>
              </button>

              <button
                onClick={onNavigateToExploration}
                className="w-full py-2 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium rounded-xs border border-stone-300 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-stone-500" />
                <span>Return to Exploration Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Modal */}
      <ResourceHowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
    </div>
  );
};
