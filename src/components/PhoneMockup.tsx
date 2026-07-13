import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, Grid, Compass, MessageSquare, Sparkles, 
  Battery, Wifi, Clock, Calculator, Calendar, 
  Settings, Check, Home, ChevronRight, Play, Sun, Moon, Volume2
} from 'lucide-react';

export default function PhoneMockup() {
  const [isOpen, setIsOpen] = useState(false);
  const [bubblePosition, setBubblePosition] = useState(30); // % from top
  const [dockOpacity, setDockOpacity] = useState(0.85);
  const [dockColor, setDockColor] = useState('indigo'); // indigo, emerald, rose, slate
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [currentApp, setCurrentApp] = useState<'home' | 'settings' | 'shortcuts' | 'calc'>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Simple mini calculator function
  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Safe evaluation
        const clean = calcInput.replace(/[^0-9+\-*/.]/g, '');
        const res = Function(`"use strict"; return (${clean})`)();
        setCalcResult(String(res));
      } catch (e) {
        setCalcResult('Error');
      }
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  const getDockBgClass = () => {
    const opacityStyle = { backgroundColor: `rgba(15, 23, 42, ${dockOpacity})` };
    switch (dockColor) {
      case 'emerald':
        return `backdrop-blur-xl border-l border-emerald-500/20 text-emerald-100`;
      case 'rose':
        return `backdrop-blur-xl border-l border-rose-500/20 text-rose-100`;
      case 'indigo':
      default:
        return `backdrop-blur-xl border-l border-indigo-500/20 text-indigo-100`;
    }
  };

  const apps = [
    { name: 'Instagram', icon: '📸', category: 'Social' },
    { name: 'WhatsApp', icon: '💬', category: 'Social' },
    { name: 'YouTube', icon: '📺', category: 'Media' },
    { name: 'Spotify', icon: '🎵', category: 'Media' },
    { name: 'Maps', icon: '🗺️', category: 'Tools' },
    { name: 'Chrome', icon: '🌐', category: 'Tools' },
  ];

  return (
    <div className="relative w-full max-w-[340px] aspect-[9/18.5] mx-auto bg-neutral-900 rounded-[50px] p-3.5 shadow-2xl border-4 border-neutral-800 ring-1 ring-white/10 overflow-hidden">
      {/* Speaker Bar & Camera Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-40 bg-neutral-900 rounded-b-3xl z-50 flex items-center justify-center px-4">
        <div className="w-12 h-1 bg-neutral-800 rounded-full mr-2"></div>
        <div className="w-2.5 h-2.5 bg-neutral-950 rounded-full border border-neutral-800"></div>
      </div>

      {/* Screen Container */}
      <div className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        
        {/* Status Bar */}
        <div className="h-9 px-6 pt-2 flex justify-between items-center text-[11px] font-medium opacity-80 z-40 select-none">
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="inline" />
            <span>12:00</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi size={11} />
            <Battery size={13} className="rotate-0" />
            <span>85%</span>
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 flex flex-col p-5 relative select-none">
          
          {currentApp === 'home' && (
            <div className="flex-1 flex flex-col justify-between pt-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-indigo-500 font-bold mb-1">Android Companion</div>
                <h4 className="text-xl font-extrabold tracking-tight">Active Preview</h4>
                <p className="text-xs text-slate-400 mt-1">Interact with the handle on the right edge. Drag or click it to deploy your Floating Dock.</p>
              </div>

              {/* Grid of default phone widgets */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
                  <Calendar size={16} className="text-indigo-400" />
                  <span className="text-[10px] text-slate-400 font-medium">Schedule</span>
                  <span className="text-xs font-semibold leading-tight">Meeting at 3 PM</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
                  <Sliders size={16} className="text-emerald-400" />
                  <span className="text-[10px] text-slate-400 font-medium">Screentime</span>
                  <span className="text-xs font-semibold leading-tight">2h 45m today</span>
                </div>
              </div>

              {/* Quick instructions indicator */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-500/0 border border-indigo-500/10 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg animate-pulse">
                  <Sparkles size={14} />
                </div>
                <p className="text-[10px] text-indigo-200/80 leading-relaxed">Swipe or click the translucent pill on the edge!</p>
              </div>

              {/* Bottom Hotbar */}
              <div className="flex justify-around py-2 border-t border-white/5 mt-auto">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">📞</div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">💬</div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">🌐</div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">⚙️</div>
              </div>
            </div>
          )}

          {currentApp === 'settings' && (
            <div className="flex-1 flex flex-col pt-2">
              <button 
                onClick={() => setCurrentApp('home')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-3 flex items-center gap-1"
              >
                ← Back Home
              </button>
              <h5 className="text-sm font-bold border-b border-white/5 pb-1.5 mb-3 flex items-center gap-1.5">
                <Settings size={14} className="text-indigo-400" /> Dock Design Sandbox
              </h5>

              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {/* Theme Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Accent Color</label>
                  <div className="flex gap-2">
                    {['indigo', 'emerald', 'rose'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setDockColor(color)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize border transition-all ${
                          dockColor === color 
                            ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300' 
                            : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacity Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
                    <span>Dock Opacity</span>
                    <span className="text-indigo-400">{Math.round(dockOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="0.95"
                    step="0.05"
                    value={dockOpacity}
                    onChange={(e) => setDockOpacity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Handle position slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
                    <span>Trigger Height</span>
                    <span className="text-indigo-400">{bubblePosition}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    step="1"
                    value={bubblePosition}
                    onChange={(e) => setBubblePosition(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* System toggles */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Device Settings</span>
                  <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl text-xs">
                    <span>Dark Mode Interface</span>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-400'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* THE FLOATING DOCK OVERLAY COMPONENT       */}
          {/* ========================================== */}
          
          {/* 1. Floating trigger handle (bubble) */}
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-0 w-3.5 h-16 bg-white/20 border border-white/20 hover:bg-indigo-500/50 hover:border-indigo-400/50 cursor-pointer rounded-l-xl flex items-center justify-center transition-all duration-200 z-50 group shadow-lg"
            style={{ 
              top: `${bubblePosition}%`,
              boxShadow: isOpen ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none',
              backgroundColor: isOpen ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.15)'
            }}
          >
            <motion.div 
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-white text-[8px]"
            >
              <ChevronRight size={10} className="mr-0.5" />
            </motion.div>
          </div>

          {/* 2. Slide Out Dock (Glassmorphic Container) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className={`absolute right-0 top-0 bottom-0 w-[185px] z-40 p-4 pt-12 flex flex-col justify-between ${getDockBgClass()}`}
                style={{
                  backgroundColor: isDarkMode 
                    ? `rgba(15, 23, 42, ${dockOpacity})` 
                    : `rgba(255, 255, 255, ${dockOpacity})`,
                  color: isDarkMode ? '#e2e8f0' : '#0f172a'
                }}
              >
                {/* Header inside dock */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Grid size={13} className="text-indigo-400" />
                      <span className="text-xs font-extrabold tracking-wider uppercase">FloatDock</span>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="text-[10px] opacity-60 hover:opacity-100"
                    >
                      Close
                    </button>
                  </div>

                  {/* Quick-toggle shortcuts tab */}
                  <div className="flex justify-between gap-1 border-b border-white/5 pb-2">
                    <button 
                      onClick={() => setCurrentApp('home')}
                      className={`p-1.5 rounded-lg flex-1 flex flex-col items-center gap-1 transition ${
                        currentApp === 'home' ? 'bg-indigo-500/20 text-indigo-400 font-bold' : 'bg-white/5 opacity-70'
                      }`}
                    >
                      <Home size={12} />
                      <span className="text-[8px]">Home</span>
                    </button>
                    <button 
                      onClick={() => setCurrentApp('calc')}
                      className={`p-1.5 rounded-lg flex-1 flex flex-col items-center gap-1 transition ${
                        currentApp === 'calc' ? 'bg-indigo-500/20 text-indigo-400 font-bold' : 'bg-white/5 opacity-70'
                      }`}
                    >
                      <Calculator size={12} />
                      <span className="text-[8px]">Calc</span>
                    </button>
                    <button 
                      onClick={() => setCurrentApp('settings')}
                      className={`p-1.5 rounded-lg flex-1 flex flex-col items-center gap-1 transition ${
                        currentApp === 'settings' ? 'bg-indigo-500/20 text-indigo-400 font-bold' : 'bg-white/5 opacity-70'
                      }`}
                    >
                      <Sliders size={12} />
                      <span className="text-[8px]">Sandbox</span>
                    </button>
                  </div>

                  {/* Body Content based on dynamic dock view */}
                  {currentApp !== 'calc' ? (
                    <div className="space-y-3">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Favorite Apps</span>
                      <div className="grid grid-cols-2 gap-2">
                        {apps.map((app, i) => (
                          <div 
                            key={i} 
                            onClick={() => alert(`Launching ${app.name} inside FloatDock overlay!`)}
                            className="p-1.5 bg-white/5 hover:bg-indigo-500/10 cursor-pointer rounded-lg flex flex-col items-center text-center border border-white/5 hover:border-indigo-500/20 transition group"
                          >
                            <span className="text-base group-hover:scale-110 transition">{app.icon}</span>
                            <span className="text-[8px] font-medium mt-0.5 truncate w-full">{app.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Music widget mock */}
                      <div className="p-2 bg-gradient-to-br from-indigo-500/15 to-purple-500/5 rounded-xl border border-indigo-500/10 mt-2 space-y-1">
                        <span className="text-[8px] text-indigo-300 font-bold uppercase tracking-wider">Now Playing</span>
                        <div className="flex items-center justify-between">
                          <div className="truncate pr-2">
                            <p className="text-[9px] font-bold truncate leading-tight">Focus Ambient Beats</p>
                            <p className="text-[7px] text-slate-400 truncate">FloatDock Synth</p>
                          </div>
                          <div className="p-1 bg-indigo-500/30 text-indigo-300 rounded-full cursor-pointer hover:bg-indigo-500/50">
                            <Play size={8} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Mini calculator inside the Dock!
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Quick Overlay Calculator</span>
                      
                      <div className="bg-slate-950/80 p-2 rounded-lg border border-white/5 text-right font-mono overflow-hidden min-h-[48px] flex flex-col justify-end">
                        <div className="text-[8px] text-slate-500 truncate">{calcInput || '0'}</div>
                        <div className="text-xs text-indigo-400 font-bold truncate">{calcResult || '0'}</div>
                      </div>

                      <div className="grid grid-cols-4 gap-1 text-[10px]">
                        {['7', '8', '9', '/'].map(k => (
                          <button key={k} onClick={() => handleCalcClick(k)} className="p-1 bg-white/5 rounded hover:bg-white/10 font-bold">{k}</button>
                        ))}
                        {['4', '5', '6', '*'].map(k => (
                          <button key={k} onClick={() => handleCalcClick(k)} className="p-1 bg-white/5 rounded hover:bg-white/10 font-bold">{k}</button>
                        ))}
                        {['1', '2', '3', '-'].map(k => (
                          <button key={k} onClick={() => handleCalcClick(k)} className="p-1 bg-white/5 rounded hover:bg-white/10 font-bold">{k}</button>
                        ))}
                        {['C', '0', '=', '+'].map(k => (
                          <button 
                            key={k} 
                            onClick={() => handleCalcClick(k)} 
                            className={`p-1 rounded font-bold ${
                              k === '=' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer in dock */}
                <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[8px] text-slate-400">
                  <span>Battery Overlay: Optimised</span>
                  <Sliders size={8} className="text-indigo-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
