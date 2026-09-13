import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Layers, 
  TrendingUp, 
  Sliders, 
  CheckSquare, 
  LayoutDashboard, 
  Database, 
  Cpu, 
  GitBranch, 
  FileText,
  ChevronRight,
  Info,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export type MainTab = 
  | 'overview' 
  | 'exploration' 
  | 'resource' 
  | 'production' 
  | 'scenarios' 
  | 'actions'
  | 'datasources'
  | 'modelcenter'
  | 'architecture'
  | 'sihmatrix'
  | 'landing';

interface HeaderProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onOpenLanding: () => void;
  isAiAssistantOpen?: boolean;
  onToggleAiAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onSelectTab, 
  onOpenLanding,
  isAiAssistantOpen = false,
  onToggleAiAssistant,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close sidebar on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const primaryTabs: { id: MainTab; label: string; icon: React.FC<{ className?: string }>; question: string; step?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, question: 'What needs attention?' },
    { id: 'exploration', label: 'Exploration', icon: Compass, question: 'Where to investigate?', step: 1 },
    { id: 'resource', label: 'Resource', icon: Layers, question: 'What could be there?', step: 2 },
    { id: 'production', label: 'Production', icon: TrendingUp, question: 'Will we meet target?', step: 3 },
    { id: 'scenarios', label: 'Scenarios', icon: Sliders, question: 'What if we change?', step: 4 },
    { id: 'actions', label: 'Actions', icon: CheckSquare, question: 'What should we do?', step: 5 },
  ];

  const secondaryTabs: { id: MainTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { id: 'modelcenter', label: 'Model Center', icon: Cpu },
    { id: 'architecture', label: 'Architecture', icon: GitBranch },
    { id: 'sihmatrix', label: 'SIH Matrix', icon: FileText },
  ];

  const currentActiveTabObj = 
    primaryTabs.find((t) => t.id === activeTab) || 
    secondaryTabs.find((t) => t.id === activeTab);

  const handleSelectTab = (tab: MainTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50 select-none shadow-xs">
      {/* Top corporate & pilot status bar */}
      <div className="px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between border-b border-stone-100 bg-[#faf9f6] text-xs">
        <div className="flex items-center space-x-3">
          {/* Mobile 3-Lines Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-1 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-200/70 border border-stone-200/80 transition-colors cursor-pointer flex items-center justify-center bg-white shadow-2xs"
            aria-label="Open navigation sidebar"
            title="Open navigation menu (3 lines)"
          >
            <Menu className="w-5 h-5 text-stone-800" />
          </button>

          <button 
            onClick={onOpenLanding}
            className="flex items-center space-x-2.5 text-left group hover:opacity-90 transition-opacity cursor-pointer"
            title="Return to Welcome Overview"
          >
            {/* Manganese / Raw Ochre ore mark */}
            <div className="w-7 h-7 rounded-lg bg-[#b45309] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
              M
            </div>
            <div>
              <div className="font-semibold text-stone-900 flex items-center gap-2 text-xs sm:text-[13px] tracking-tight">
                MOIL Mining Intelligence
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600 font-mono border border-stone-200 hidden md:inline-block">
                  SIH26009
                </span>
              </div>
              <div className="text-[11px] text-stone-500 font-normal truncate max-w-[170px] sm:max-w-none">
                Balaghat–Nagpur Manganese Belt &bull; Ministry of Steel
              </div>
            </div>
          </button>

          {/* Mobile active tab pill */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium border border-stone-200 transition-colors cursor-pointer"
            title="Switch module"
          >
            <span className="max-w-[85px] truncate">{currentActiveTabObj?.label}</span>
            <ChevronRight className="w-3 h-3 text-stone-400 rotate-90 shrink-0" />
          </button>

          <div className="hidden lg:flex items-center text-stone-400 pl-3 border-l border-stone-200 text-[11px] font-sans">
            <span className="text-stone-500">Explore &bull; Estimate &bull; Predict &bull; Act</span>
          </div>
        </div>

        {/* Global DEMO MODE indicator */}
        <div className="flex items-center space-x-2.5 mt-1 sm:mt-0">
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-50/90 border border-amber-200 text-amber-800 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="font-bold tracking-wide">DEMO MODE</span>
            <span className="text-[10px] text-amber-700 hidden sm:inline">&bull; SIMULATED DATA</span>
          </div>

          <div className="hidden xl:flex items-center space-x-1.5 text-[11px] text-stone-600 bg-stone-100/80 px-2.5 py-0.5 rounded-full border border-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span className="font-mono text-[10px]">SENTINEL-2 + SRTM</span>
          </div>

          {/* AI Assistant Global Header Toggle */}
          {onToggleAiAssistant && (
            <button
              id="header-ai-toggle-btn"
              onClick={onToggleAiAssistant}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                isAiAssistantOpen
                  ? 'bg-amber-100/90 text-amber-950 border-amber-300 shadow-2xs font-semibold'
                  : 'bg-white text-stone-700 hover:text-stone-950 hover:bg-stone-100 border-stone-200 shadow-2xs'
              }`}
              title="Toggle MOIL Contextual AI Assistant Panel"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiAssistantOpen ? 'text-amber-700' : 'text-amber-600'}`} />
              <span className="font-semibold text-[11px]">AI Assistant</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isAiAssistantOpen ? 'bg-amber-600' : 'bg-emerald-500'}`} />
            </button>
          )}
        </div>
      </div>

      {/* Primary Workflow Navigation & Decision Tabs (Desktop & Tablet) - Hidden on Mobile in favor of 3-Lines Sidebar */}
      <div className="hidden md:flex px-4 sm:px-6 py-1.5 items-center justify-between overflow-x-auto no-scrollbar gap-2 bg-white">
        <nav className="flex items-center space-x-1">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`group flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
              >
                {tab.step && (
                  <span className={`text-[10px] font-mono ${
                    isActive ? 'text-amber-300 font-bold' : 'text-stone-400'
                  }`}>
                    0{tab.step}
                  </span>
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500 group-hover:text-stone-800'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="text-[10px] text-stone-300 hidden xl:inline font-mono">
                    [{tab.question}]
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Workflow pipeline breadcrumb */}
        <div className="hidden 2xl:flex items-center space-x-1 text-[11px] font-mono text-stone-500 bg-[#f7f6f2] px-3 py-1 rounded-full border border-stone-200">
          <span className={activeTab === 'exploration' ? 'text-amber-700 font-bold' : 'text-stone-600'}>01 EXPLORE</span>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className={activeTab === 'resource' ? 'text-amber-700 font-bold' : 'text-stone-600'}>02 ESTIMATE</span>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className={activeTab === 'production' ? 'text-amber-700 font-bold' : 'text-stone-600'}>03 PREDICT</span>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className={activeTab === 'scenarios' ? 'text-amber-700 font-bold' : 'text-stone-600'}>04 SIMULATE</span>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className={activeTab === 'actions' ? 'text-amber-700 font-bold' : 'text-stone-600'}>05 ACT</span>
        </div>

        {/* Secondary Navigation & AI Intelligence Panel Toggle */}
        <div className="flex items-center space-x-1 pl-2 border-l border-stone-200">
          {secondaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-sec-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-sans flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-stone-100 text-stone-900 font-semibold border border-stone-300'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
                title={tab.label}
              >
                <Icon className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}

          {/* Dedicated AI Assistant Toggle in Secondary Nav */}
          {onToggleAiAssistant && (
            <button
              id="nav-sec-ai-assistant"
              onClick={onToggleAiAssistant}
              className={`ml-1 px-3 py-1.5 rounded-xl text-xs font-sans flex items-center space-x-1.5 transition-all whitespace-nowrap cursor-pointer border ${
                isAiAssistantOpen
                  ? 'bg-stone-900 text-white font-semibold border-stone-900 shadow-2xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 font-medium'
              }`}
              title="Toggle Contextual AI Assistant"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiAssistantOpen ? 'text-amber-300' : 'text-amber-700'}`} />
              <span>AI Panel</span>
              <span className={`text-[9px] font-mono px-1 rounded ${
                isAiAssistantOpen ? 'bg-stone-800 text-amber-300' : 'bg-amber-200/80 text-amber-900 font-bold'
              }`}>
                MAPS
              </span>
            </button>
          )}
        </div>
      </div>

      {/* MOBILE SLIDE-IN SIDEBAR DRAWER ("3 LINES" MENU) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Dark Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col z-[101] animate-in slide-in-from-left duration-250 border-r border-stone-200">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-stone-200 bg-[#faf9f6] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#b45309] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
                  M
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">MOIL Intelligence</div>
                  <div className="text-[11px] text-stone-500">Balaghat–Nagpur Belt</div>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/70 transition-colors cursor-pointer"
                title="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Status Pill */}
            <div className="p-3 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-amber-800 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="font-semibold">DEMO &bull; SIMULATED DATA</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600 font-mono text-[10px]">
                SIH26009
              </span>
            </div>

            {/* Sidebar Navigation Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Primary Workflow */}
              <div>
                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 mb-1.5">
                  Core Workflow
                </div>
                <div className="space-y-1">
                  {primaryTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSelectTab(tab.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
                          <div>
                            <div className="font-semibold text-xs flex items-center space-x-1.5">
                              {tab.step && (
                                <span className={`font-mono text-[10px] ${isActive ? 'text-amber-300' : 'text-stone-400'}`}>
                                  0{tab.step}.
                                </span>
                              )}
                              <span>{tab.label}</span>
                            </div>
                            <div className={`text-[10px] ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                              {tab.question}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Assistant Mobile Action */}
              {onToggleAiAssistant && (
                <div className="pt-2 border-t border-stone-200">
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 mb-1.5">
                    Geological Intelligence
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onToggleAiAssistant();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isAiAssistantOpen
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>{isAiAssistantOpen ? 'Close AI Assistant' : 'Open AI Assistant'}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                      MAPS
                    </span>
                  </button>
                </div>
              )}

              {/* System & Architecture */}
              <div>
                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 mb-1.5">
                  System Architecture & Docs
                </div>
                <div className="space-y-1">
                  {secondaryTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSelectTab(tab.id)}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                          isActive
                            ? 'bg-stone-200/80 text-stone-900 font-semibold'
                            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-stone-500" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-stone-200 bg-[#faf9f6] text-[11px] text-stone-500 flex items-center justify-between">
              <span>Ministry of Steel Pilot</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLanding();
                }}
                className="text-stone-700 hover:text-stone-950 font-medium underline cursor-pointer"
              >
                Welcome Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
