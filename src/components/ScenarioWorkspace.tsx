import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Zap, 
  Layers, 
  CloudRain,
  TrendingUp,
  CheckSquare
} from 'lucide-react';
import { ScenarioParameters, ScenarioSimulationResult } from '../types';
import { DEFAULT_SCENARIO_PARAMS, runScenarioSimulation } from '../data/scenarioData';

interface ScenarioWorkspaceProps {
  onNavigateToActions: () => void;
}

export const ScenarioWorkspace: React.FC<ScenarioWorkspaceProps> = ({ onNavigateToActions }) => {
  const [params, setParams] = useState<ScenarioParameters>(DEFAULT_SCENARIO_PARAMS);
  const [simulationResult, setSimulationResult] = useState<ScenarioSimulationResult>(
    runScenarioSimulation(DEFAULT_SCENARIO_PARAMS)
  );
  const [hasSimulated, setHasSimulated] = useState(false);

  const handleSimulate = (customParams?: ScenarioParameters) => {
    const activeParams = customParams || params;
    const result = runScenarioSimulation(activeParams);
    setSimulationResult(result);
    setHasSimulated(true);
  };

  const applyPresetRecovery = () => {
    const recommendedParams: ScenarioParameters = {
      equipmentAvailabilityPct: 85,
      blastingDelayHours: 6,
      mineAAllocationPct: 50,
      targetProductionKt: 52.0,
      weatherCondition: 'Favorable (Dry)',
      selectedMineId: 'all',
    };
    setParams(recommendedParams);
    handleSimulate(recommendedParams);
  };

  const resetToBaseline = () => {
    setParams(DEFAULT_SCENARIO_PARAMS);
    handleSimulate(DEFAULT_SCENARIO_PARAMS);
    setHasSimulated(false);
  };

  return (
    <div className="space-y-3.5 select-none">
      {/* Top Command Bar */}
      <div className="bg-white px-4 py-3 rounded-xs border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-900">
            <Sliders className="w-4 h-4 text-amber-700" />
            <span>04 WHAT-IF SCENARIO SIMULATOR</span>
          </div>
          <span className="text-stone-300 hidden sm:inline">|</span>
          <div className="text-xs text-stone-500 hidden sm:inline">
            Parametric Sensitivity Response Model &bull; 9-Day Recovery Window
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={applyPresetRecovery}
            className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium rounded-xs border border-stone-300 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Load Recovery Preset (85% / 6h / 50%)</span>
          </button>

          <button
            onClick={onNavigateToActions}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Proceed to Action Directives</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* LEFT COLUMN: Interactive Levers & Sliders (6 Cols) */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="bg-white p-4 rounded-xs border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                Operational Levers & Levers Controls
              </span>
              <button
                onClick={resetToBaseline}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Baseline</span>
              </button>
            </div>

            {/* Lever 1: Equipment Availability */}
            <div className="space-y-1.5 bg-[#fcfbf9] p-3 rounded-xs border border-stone-200">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-1.5 font-medium text-stone-800">
                  <Wrench className="w-3.5 h-3.5 text-stone-600" />
                  <span>Fleet Equipment Availability</span>
                </span>
                <div className="font-mono text-xs">
                  <span className="text-stone-400 line-through mr-2">Base: 72%</span>
                  <span className="text-stone-900 font-bold">{params.equipmentAvailabilityPct}%</span>
                </div>
              </div>
              <input
                type="range"
                min={60}
                max={95}
                step={1}
                value={params.equipmentAvailabilityPct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updated = { ...params, equipmentAvailabilityPct: val };
                  setParams(updated);
                  handleSimulate(updated);
                }}
                className="w-full accent-stone-900 cursor-pointer h-1.5 bg-stone-200 rounded-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-stone-500">
                <span>60% (Critical)</span>
                <span>72% (Baseline)</span>
                <span>85% (Target)</span>
                <span>95% (Ceiling)</span>
              </div>
            </div>

            {/* Lever 2: Blasting Window Delay */}
            <div className="space-y-1.5 bg-[#fcfbf9] p-3 rounded-xs border border-stone-200">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-1.5 font-medium text-stone-800">
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                  <span>Blasting Clearance Delay Window</span>
                </span>
                <div className="font-mono text-xs">
                  <span className="text-stone-400 line-through mr-2">Base: 12h</span>
                  <span className="text-stone-900 font-bold">{params.blastingDelayHours} Hours</span>
                </div>
              </div>
              <input
                type="range"
                min={2}
                max={24}
                step={1}
                value={params.blastingDelayHours}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updated = { ...params, blastingDelayHours: val };
                  setParams(updated);
                  handleSimulate(updated);
                }}
                className="w-full accent-stone-900 cursor-pointer h-1.5 bg-stone-200 rounded-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-stone-500">
                <span>2h (Optimal)</span>
                <span>6h (Sync)</span>
                <span>12h (Baseline)</span>
                <span>24h (Max Stoppage)</span>
              </div>
            </div>

            {/* Lever 3: Mine A (Balaghat Deep) Allocation */}
            <div className="space-y-1.5 bg-[#fcfbf9] p-3 rounded-xs border border-stone-200">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-1.5 font-medium text-stone-800">
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  <span>Balaghat Deep High-Grade Quota</span>
                </span>
                <div className="font-mono text-xs">
                  <span className="text-stone-400 line-through mr-2">Base: 40%</span>
                  <span className="text-amber-800 font-bold">{params.mineAAllocationPct}%</span>
                </div>
              </div>
              <input
                type="range"
                min={25}
                max={60}
                step={5}
                value={params.mineAAllocationPct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const updated = { ...params, mineAAllocationPct: val };
                  setParams(updated);
                  handleSimulate(updated);
                }}
                className="w-full accent-stone-900 cursor-pointer h-1.5 bg-stone-200 rounded-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-stone-500">
                <span>25% (Low)</span>
                <span>40% (Baseline)</span>
                <span>50% (High-Grade Surge)</span>
                <span>60% (Shaft Limit)</span>
              </div>
            </div>

            {/* Lever 4: Weather Contingency */}
            <div className="space-y-1.5 bg-[#fcfbf9] p-3 rounded-xs border border-stone-200">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-1.5 font-medium text-stone-800">
                  <CloudRain className="w-3.5 h-3.5 text-sky-700" />
                  <span>Meteorological & Dewatering Bias</span>
                </span>
                <span className="font-mono font-bold text-stone-900 text-xs">{params.weatherCondition}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['Favorable (Dry)', 'Moderate Rain', 'Heavy Monsoon'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      const updated = { ...params, weatherCondition: w };
                      setParams(updated);
                      handleSimulate(updated);
                    }}
                    className={`py-1.5 px-2 rounded-xs text-[11px] font-medium transition-colors cursor-pointer border ${
                      params.weatherCondition === w
                        ? 'bg-stone-900 border-stone-900 text-white font-semibold'
                        : 'bg-white border-stone-300 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Simulate Button */}
            <button
              id="simulate-scenario-btn"
              onClick={() => handleSimulate()}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <Sliders className="w-4 h-4 text-amber-300" />
              <span>Recalculate Scenario Projection</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Comparative Results (Baseline vs Scenario) (6 Cols) */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="bg-white p-4 rounded-xs border border-stone-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                Comparative Forecast Matrix
              </span>
              <span className="text-xs text-stone-500 font-mono">Target Ceiling: {params.targetProductionKt} kt</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* CURRENT BASELINE PLAN */}
              <div className="bg-[#fcfbf9] p-3 rounded-xs border border-stone-200">
                <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Current Baseline
                </div>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Forecast:</span>
                    <span className="text-xl font-bold font-mono text-stone-900">
                      {simulationResult.baselineForecastKt} kt
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Deficit:</span>
                    <span className="text-lg font-bold font-mono text-red-600">
                      -{simulationResult.baselineShortfallKt} kt
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Threat Level:</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-800 text-[10px] font-semibold inline-block">
                      High Risk
                    </span>
                  </div>
                </div>
              </div>

              {/* SIMULATED SCENARIO */}
              <div className="bg-emerald-50/50 p-3 rounded-xs border border-emerald-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[9px] font-mono px-1.5 py-0.5 border-b border-l border-emerald-300 font-bold">
                  SIMULATED
                </div>
                <div className="text-[10px] font-semibold text-emerald-900 uppercase tracking-wider mb-1">
                  Simulated Outcome
                </div>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[10px] text-stone-500 block">New Forecast:</span>
                    <span className="text-xl font-bold font-mono text-emerald-800">
                      {simulationResult.simulatedForecastKt} kt
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">New Deficit:</span>
                    <span className="text-lg font-bold font-mono text-emerald-800">
                      {simulationResult.simulatedShortfallKt <= 0 ? '0.0 kt (Target Met)' : `-${simulationResult.simulatedShortfallKt} kt`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">New Threat Level:</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold inline-block border ${
                        simulationResult.simulatedRisk === 'LOW'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : simulationResult.simulatedRisk === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                      }`}
                    >
                      {simulationResult.simulatedRisk} Risk
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Recovery Highlight Banner */}
            <div className="bg-[#faf9f6] p-3.5 rounded-xs border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-500 block font-medium">Net Recovered Production</span>
                <span className="text-xl font-bold font-mono text-emerald-800">
                  +{((simulationResult.simulatedForecastKt - simulationResult.baselineForecastKt) * 1000).toFixed(0)} Tonnes
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-stone-500 block font-medium">Deficit Closed</span>
                <span className="text-lg font-bold font-mono text-stone-900">
                  {(
                    ((simulationResult.baselineShortfallKt - simulationResult.simulatedShortfallKt) /
                      simulationResult.baselineShortfallKt) *
                    100
                  ).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Recovery Contribution Breakdown by Lever */}
            <div>
              <span className="text-xs font-semibold text-stone-800 uppercase tracking-wide block mb-2">
                Simulated Tonnage Impact by Lever
              </span>

              <div className="space-y-2">
                {simulationResult.recoveryBreakdown.map((item) => (
                  <div key={item.lever} className="p-2.5 bg-[#fcfbf9] rounded-xs border border-stone-200 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-stone-900 text-xs">{item.lever}</div>
                      <div className="text-[11px] text-stone-500">{item.feasibility}</div>
                    </div>
                    <span
                      className={`font-mono font-bold text-xs ${
                        item.tonnesRecovered >= 0 ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {item.tonnesRecovered >= 0 ? `+${item.tonnesRecovered}` : item.tonnesRecovered} t
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA to Actions */}
            <div className="pt-2">
              <button
                onClick={onNavigateToActions}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Review & Approve Corrective Action Directives</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
