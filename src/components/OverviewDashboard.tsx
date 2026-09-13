import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  Layers, 
  TrendingUp, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  MapPin, 
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { ExplorationTarget, WorkflowStep } from '../types';
import { CURRENT_PRODUCTION_SUMMARY, CAUSAL_SHORTFALL_FACTORS, generateMonthlyProductionSeries } from '../data/productionData';

interface OverviewDashboardProps {
  targets: ExplorationTarget[];
  onSelectTarget: (t: ExplorationTarget) => void;
  onNavigateToStep: (step: WorkflowStep) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  targets,
  onSelectTarget,
  onNavigateToStep,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedMapTarget, setSelectedMapTarget] = useState<ExplorationTarget>(targets[0]);
  const [hoveredProductionDay, setHoveredProductionDay] = useState<number | null>(null);

  const highTargets = targets.filter((t) => t.prospectivity === 'HIGH');
  const totalResource = targets.reduce((sum, t) => sum + t.resourceSummary.targetResourceMt, 0);
  const avgGrade = (
    targets.reduce((sum, t) => sum + t.resourceSummary.gradeMnPct, 0) / targets.length
  ).toFixed(1);

  // Production series data for chart
  const series = generateMonthlyProductionSeries();
  const actualPoints = series.filter((pt) => !pt.isForecast);
  const forecastPoints = series.filter((pt) => pt.day >= 21);

  // Chart dimensions and scaling
  const chartW = 600;
  const chartH = 220;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 30;
  const maxVal = 56000;

  const getX = (day: number) => padL + ((day - 1) / 29) * (chartW - padL - padR);
  const getY = (val: number) => chartH - padB - (val / maxVal) * (chartH - padT - padB);

  // Paths
  const targetPath = series.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getX(pt.day)} ${getY(pt.targetCumulativeTonnes)}`;
  }, '');

  const actualPath = actualPoints.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getX(pt.day)} ${getY(pt.actualCumulativeTonnes || 0)}`;
  }, '');

  const forecastPath = forecastPoints.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getX(pt.day)} ${getY(pt.forecastCumulativeTonnes)}`;
  }, '');

  // Initialize Overview regional exploration map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [21.72, 79.92],
        zoom: 9,
        minZoom: 8,
        maxZoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Clean Light Cartographic Basemap (Positron / Voyager)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Regional Sausar Formation belt corridor
      const sausarCoords: L.LatLngExpression[] = [
        [21.98, 80.55],
        [21.85, 80.30],
        [21.72, 79.80],
        [21.58, 79.50],
        [21.45, 79.20],
        [21.35, 78.95],
        [21.28, 79.10],
        [21.36, 79.40],
        [21.50, 79.85],
        [21.65, 80.25],
        [21.88, 80.55],
      ];

      L.polygon(sausarCoords, {
        color: '#b45309',
        weight: 1.5,
        fillColor: '#f59e0b',
        fillOpacity: 0.1,
        dashArray: '4,4',
      }).addTo(map);

      // Target markers
      targets.forEach((t) => {
        const isHigh = t.prospectivity === 'HIGH';
        const markerColor = isHigh ? '#15803d' : '#b45309';

        // Prospectivity buffer halo
        L.circle(t.coordinates, {
          radius: t.score * 7000,
          color: markerColor,
          weight: 1,
          fillColor: markerColor,
          fillOpacity: 0.12,
        }).addTo(map);

        // Circular custom icon
        const iconHtml = `
          <div style="
            background: #ffffff;
            border: 2px solid ${markerColor};
            color: #1c1917;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: ${markerColor};"></span>
            ${t.code}
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-map-pin',
          html: iconHtml,
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const marker = L.marker(t.coordinates, { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedMapTarget(t);
          onSelectTarget(t);
        });
      });

      mapInstanceRef.current = map;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [targets, onSelectTarget]);

  return (
    <div className="space-y-4 select-none">
      {/* Editorial Header Strip */}
      <div className="bg-white p-4.5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-700 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>Balaghat–Nagpur Manganese Belt Pilot &bull; Executive Decision Dashboard</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Integrated spatial prospectivity, geological resource estimation, and production shortfall recovery.
          </p>
        </div>

        {/* 5-Step Workflow Stepper Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { step: 'explore' as WorkflowStep, label: '01 Explore', icon: Compass },
            { step: 'estimate' as WorkflowStep, label: '02 Estimate', icon: Layers },
            { step: 'predict' as WorkflowStep, label: '03 Predict', icon: TrendingUp },
            { step: 'simulate' as WorkflowStep, label: '04 Simulate', icon: Sliders },
            { step: 'act' as WorkflowStep, label: '05 Act', icon: CheckCircle2 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.step}
                onClick={() => onNavigateToStep(item.step)}
                className="px-3 py-1.5 text-xs font-medium rounded-xl bg-[#f7f6f2] hover:bg-stone-200 text-stone-700 hover:text-stone-900 border border-stone-200 transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-stone-500" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 PRIMARY KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: High-Priority Exploration Targets */}
        <div 
          onClick={() => onNavigateToStep('explore')}
          className="bg-white p-4.5 rounded-2xl border border-stone-200/90 hover:border-stone-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Exploration Targets</span>
            <Compass className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-stone-900">{targets.length}</span>
            <span className="text-xs text-stone-500">identified</span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-emerald-800 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full w-fit border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>{highTargets.length} High-Priority Zones</span>
          </div>
        </div>

        {/* KPI 2: Estimated Geological Target */}
        <div 
          onClick={() => onNavigateToStep('estimate')}
          className="bg-white p-4.5 rounded-2xl border border-stone-200/90 hover:border-stone-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Estimated Geological Target</span>
            <Layers className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-amber-800">{totalResource.toFixed(1)}</span>
            <span className="text-xs text-stone-600 font-medium">Mt Ore (P50)</span>
          </div>
          <div className="mt-2 text-xs text-stone-500 font-sans">
            Mean Grade: <span className="font-mono font-semibold text-stone-800">{avgGrade}% Mn</span> &bull; Exploration Target
          </div>
        </div>

        {/* KPI 3: Production Forecast */}
        <div 
          onClick={() => onNavigateToStep('predict')}
          className="bg-white p-4.5 rounded-2xl border border-stone-200/90 hover:border-stone-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Monthly Production Target</span>
            <TrendingUp className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-stone-900">52,000</span>
            <span className="text-xs text-stone-500">t target</span>
          </div>
          <div className="mt-2 text-xs text-stone-500 font-sans">
            Day 21 Actual: <span className="font-mono font-semibold text-stone-800">33,950 t</span> (65.3% of target)
          </div>
        </div>

        {/* KPI 4: Shortfall Risk */}
        <div 
          onClick={() => onNavigateToStep('predict')}
          className="bg-white p-4.5 rounded-2xl border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-red-700 font-medium">
            <span>Projected Shortfall Deficit</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-red-600">-3,800</span>
            <span className="text-xs font-semibold text-red-700">t (-7.3%)</span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-red-800 font-medium bg-red-50 px-2.5 py-0.5 rounded-full w-fit border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            <span>Critical Deficit &bull; Balaghat Mine</span>
          </div>
        </div>
      </div>

      {/* LARGE EXPLORATION MAP SECTION */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-[#faf9f6]">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-amber-700" />
            <div>
              <h2 className="text-sm font-semibold text-stone-900">
                Regional Exploration Prospectivity &bull; Sausar Manganese Belt
              </h2>
              <p className="text-xs text-stone-500">
                Multi-spectral Sentinel-2 SWIR band ratios combined with GSI lithological fault trace analysis.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-500 font-sans hidden sm:inline">
              Selected Target: <strong className="text-stone-900 font-mono">{selectedMapTarget.code}</strong> ({selectedMapTarget.name})
            </span>
            <button
              onClick={() => onNavigateToStep('explore')}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>Open 2D/3D Exploration Deck</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Map Canvas and Target Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Map canvas (8 cols) - Adaptive to aspect ratio */}
          <div className="lg:col-span-8 h-[340px] sm:h-[400px] md:h-[440px] lg:h-[480px] relative border-b lg:border-b-0 lg:border-r border-stone-200">
            <div ref={mapContainerRef} className="w-full h-full" />
            
            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-stone-300/90 shadow-md text-xs space-y-1.5 max-w-[calc(100vw-32px)]">
              <div className="font-semibold text-stone-800 text-[11px] uppercase tracking-wide">GIS Legend</div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <span className="text-stone-700">High Prospectivity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                <span className="text-stone-700">Moderate Prospectivity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-1 border-t-2 border-dashed border-amber-600"></span>
                <span className="text-stone-700">Sausar Formation Belt</span>
              </div>
            </div>
          </div>

          {/* Target Quick Dossier List (4 cols) */}
          <div className="lg:col-span-4 p-4 flex flex-col justify-between space-y-3 bg-[#fcfbf9]">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                  Identified Prospects
                </span>
                <span className="text-xs text-stone-400 font-mono">5 Total</span>
              </div>

              <div className="mt-2.5 space-y-2">
                {targets.map((t) => {
                  const isSelected = t.id === selectedMapTarget.id;
                  const isHigh = t.prospectivity === 'HIGH';
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedMapTarget(t);
                        onSelectTarget(t);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-amber-600 shadow-sm ring-1 ring-amber-500/20'
                          : 'bg-white/70 hover:bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-stone-900">{t.code}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isHigh ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.prospectivity}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-stone-800">
                          {t.resourceSummary.targetResourceMt} Mt
                        </span>
                      </div>
                      <div className="text-xs text-stone-600 mt-1 truncate">{t.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono mt-0.5 flex items-center justify-between">
                        <span>Grade: {t.resourceSummary.gradeMnPct}% Mn</span>
                        <span>Score: {t.score.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectTarget(selectedMapTarget);
                onNavigateToStep('estimate');
              }}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl border border-stone-300 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Estimate Tonnage for {selectedMapTarget.code}</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
            </button>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: PRODUCTION OUTLOOK CHART + PRIORITY ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Production Outlook Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-stone-700" />
              <h3 className="text-sm font-semibold text-stone-900">
                Monthly Production Outlook & Deficit Trajectory
              </h3>
            </div>
            <button
              onClick={() => onNavigateToStep('predict')}
              className="text-xs font-semibold text-stone-800 hover:text-stone-950 flex items-center space-x-1.5 cursor-pointer bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-xl border border-stone-200 transition-colors"
            >
              <span>Waterfall & Heatmap Charts</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
            </button>
          </div>

          <p className="text-xs text-stone-500">
            Day 21 Actual: <strong className="text-stone-800 font-mono">33,950 t</strong> &bull; Month-end Projected: <strong className="text-stone-800 font-mono">48,200 t</strong> &bull; Target: <strong className="text-stone-800 font-mono">52,000 t</strong>
          </p>

          {/* SVG Trajectory Chart */}
          <div className="relative bg-[#faf9f6] p-3 rounded-xl border border-stone-200 overflow-x-auto">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-48 select-none">
              {/* Grid Lines */}
              {[10000, 20000, 30000, 40000, 50000].map((v) => (
                <g key={v}>
                  <line
                    x1={padL}
                    y1={getY(v)}
                    x2={chartW - padR}
                    y2={getY(v)}
                    stroke="#e7e5e0"
                    strokeWidth="1"
                  />
                  <text
                    x={padL - 6}
                    y={getY(v) + 3}
                    textAnchor="end"
                    fontSize="9"
                    fontFamily="monospace"
                    fill="#78716c"
                  >
                    {v / 1000}k
                  </text>
                </g>
              ))}

              {/* Day Labels */}
              {[1, 5, 10, 15, 20, 25, 30].map((d) => (
                <text
                  key={d}
                  x={getX(d)}
                  y={chartH - 10}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fill="#78716c"
                >
                  D{d}
                </text>
              ))}

              {/* Day 21 Cut-off Vertical Line */}
              <line
                x1={getX(21)}
                y1={padT}
                x2={getX(21)}
                y2={chartH - padB}
                stroke="#a8a29e"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
              <text
                x={getX(21)}
                y={padT - 6}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="#b45309"
              >
                Day 21 (Today)
              </text>

              {/* Target Line (Dotted Gray) */}
              <path
                d={targetPath}
                fill="none"
                stroke="#78716c"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />

              {/* Actual Line (Solid Stone/Graphite) */}
              <path
                d={actualPath}
                fill="none"
                stroke="#1c1917"
                strokeWidth="2.5"
              />

              {/* Forecast Line (Coral/Red Projected Deficit) */}
              <path
                d={forecastPath}
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                strokeDasharray="2,2"
              />

              {/* End Point Markers */}
              <circle cx={getX(30)} cy={getY(52000)} r="4" fill="#78716c" />
              <circle cx={getX(30)} cy={getY(48200)} r="4" fill="#dc2626" />
              <circle cx={getX(21)} cy={getY(33950)} r="5" fill="#1c1917" />
            </svg>

            <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-1.5 text-xs text-stone-600 border-t border-stone-200 mt-1">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-0.5 bg-stone-900"></span>
                  <span>Actual Production</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-0.5 border-t border-dashed border-stone-500"></span>
                  <span>Target (52k t)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-0.5 bg-red-600"></span>
                  <span>Forecast Shortfall (-3.8k t)</span>
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-500">SIMULATED DATA</span>
            </div>
          </div>

          {/* Causal Factors Summary */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2">
              Primary Shortfall Drivers
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CAUSAL_SHORTFALL_FACTORS.map((f) => (
                <div key={f.factor} className="p-2.5 bg-[#fcfbf9] rounded-xl border border-stone-200 text-xs shadow-2xs">
                  <div className="text-stone-500 truncate text-[11px]">{f.factor}</div>
                  <div className="font-mono font-bold text-stone-900 mt-0.5">{f.pct}%</div>
                  <div className="text-[10px] text-red-600 font-mono">-{f.tonnesImpact} t</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Actions (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-semibold text-stone-900">
                Priority Recovery Actions
              </h3>
            </div>
            <button
              onClick={() => onNavigateToStep('act')}
              className="text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All 5 Actions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-stone-500">
            Ranked operational interventions to recover <strong className="text-stone-800">+2,900 tonnes</strong> of the projected 3,800t shortfall.
          </p>

          <div className="space-y-2.5">
            {/* Action 1 */}
            <div className="p-3 bg-[#fcfbf9] rounded-xl border border-stone-200/90 hover:border-stone-300 transition-colors shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    +1,200 TONNES &bull; HIGH IMPACT
                  </span>
                  <h4 className="text-xs font-semibold text-stone-900 mt-1">
                    Reallocate 4 Haul Trucks to Balaghat Shaft #2
                  </h4>
                </div>
                <button
                  onClick={() => onNavigateToStep('act')}
                  className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium rounded-lg transition-all shrink-0 cursor-pointer shadow-2xs"
                >
                  Approve
                </button>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Redeploy idle dumpers from Dongri Buzurg auxiliary waste haulage to active production benches.
              </p>
              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Lead Time: <strong>24h</strong></span>
                <span>Confidence: <strong>92%</strong></span>
              </div>
            </div>

            {/* Action 2 */}
            <div className="p-3 bg-[#fcfbf9] rounded-xl border border-stone-200/90 hover:border-stone-300 transition-colors shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    +900 TONNES &bull; MEDIUM IMPACT
                  </span>
                  <h4 className="text-xs font-semibold text-stone-900 mt-1">
                    Shift Blasting Evacuation Window to 14:00
                  </h4>
                </div>
                <button
                  onClick={() => onNavigateToStep('act')}
                  className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium rounded-lg transition-all shrink-0 cursor-pointer shadow-2xs"
                >
                  Approve
                </button>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Align bench clearance with shift changeovers to prevent 2.5h of idle equipment standing time.
              </p>
              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Lead Time: <strong>12h</strong></span>
                <span>Confidence: <strong>88%</strong></span>
              </div>
            </div>

            {/* Action 3 */}
            <div className="p-3 bg-[#fcfbf9] rounded-xl border border-stone-200/90 hover:border-stone-300 transition-colors shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-stone-800 bg-stone-200 px-2 py-0.5 rounded-full">
                    +800 TONNES &bull; FAST WIN
                  </span>
                  <h4 className="text-xs font-semibold text-stone-900 mt-1">
                    Pre-emptive Secondary Crusher Screen Replacement
                  </h4>
                </div>
                <button
                  onClick={() => onNavigateToStep('act')}
                  className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium rounded-lg transition-all shrink-0 cursor-pointer shadow-2xs"
                >
                  Approve
                </button>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Replace worn deck meshes during 3-hour scheduled night window to restore 240 t/h throughput.
              </p>
              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Lead Time: <strong>36h</strong></span>
                <span>Confidence: <strong>85%</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToStep('simulate')}
            className="w-full py-2.5 bg-[#f7f6f2] hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulate Parametric Recovery Levers</span>
          </button>
        </div>
      </div>
    </div>
  );
};
