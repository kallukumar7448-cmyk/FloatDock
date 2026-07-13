import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AppVersion, AboutLinks, FAQItem, BlogPost, Screenshot, 
  ContactMessage, PublicSettings 
} from './types';
import PhoneMockup from './components/PhoneMockup';
import AdminPanel from './components/AdminPanel';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import BlogDetail from './components/BlogDetail';
import { 
  Sliders, Grid, Compass, MessageSquare, Sparkles, 
  Battery, Wifi, Clock, Calculator, Calendar, 
  Settings, Check, Home, ChevronRight, Play, Sun, 
  Moon, Volume2, ShieldAlert, Download, HelpCircle, 
  BookOpen, FileText, CheckCircle, Info, Heart, ArrowRight, RefreshCw, Send, Shield
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'home' | 'features' | 'download' | 'screenshots' | 'how-to-install' | 'faq' | 'about' | 'contact' | 'blog' | 'privacy' | 'terms' | 'disclaimer' | 'admin'>('home');
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulated Android Client State (For testing updates and force updates!)
  const [simulatedVersionCode, setSimulatedVersionCode] = useState<number>(1); // e.g., v1.0.0
  const [showSimulatedUpdateAlert, setShowSimulatedUpdateAlert] = useState<boolean>(false);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);

  // Contact Form Inputs
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Load public configurations on mount
  const fetchPublicSettings = async () => {
    try {
      const res = await fetch('/api/public-settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching public config', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicSettings();
  }, [view]);

  // Handle Contact submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus(null);
    setContactSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await res.json();
      if (res.ok) {
        setContactStatus({ type: 'success', text: 'Thank you! Your message has been received by the administrator dashboard.' });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setContactStatus({ type: 'error', text: data.error || 'Failed to submit.' });
      }
    } catch (err) {
      setContactStatus({ type: 'error', text: 'Network connection failure.' });
    } finally {
      setContactSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center gap-4 text-slate-400 font-sans select-none">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center animate-bounce shadow-xl shadow-indigo-600/30">
          <span className="text-white font-black text-lg">FD</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="animate-spin text-indigo-500" size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Syncing FloatDock Nodes...</span>
        </div>
      </div>
    );
  }

  // Admin View Override
  if (view === 'admin') {
    return <AdminPanel onBack={() => setView('home')} />;
  }

  const versionName = settings?.version?.version_name || '1.2.0';
  const versionCode = settings?.version?.version_code || 3;
  const isForcedActive = settings?.version?.force_update || false;

  // Render core pages
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500/35 selection:text-white">
      
      {/* Simulation Bar (Demonstrating complete Kotlin app connection guide) */}
      <div className="bg-slate-900 border-b border-white/5 px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 z-50">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <p className="text-[10px] text-slate-400 font-medium">
            <strong className="text-slate-200">Android Retrofit Demo Sandbox:</strong> Simulated user device currently running version code <strong>{simulatedVersionCode}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSimulatedVersionCode(1);
              setShowSimulatedUpdateAlert(true);
            }}
            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
          >
            Simulate Old Client Connection (Code 1) →
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => {
              setSimulatedVersionCode(versionCode);
              setShowSimulatedUpdateAlert(true);
            }}
            className="text-[10px] font-bold text-slate-400 hover:text-indigo-400 transition"
          >
            Simulate Current Client (Code {versionCode})
          </button>
        </div>
      </div>

      {/* Dynamic Simulated Android Update Dialog Modal */}
      <AnimatePresence>
        {showSimulatedUpdateAlert && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 select-none backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl space-y-4 text-center"
            >
              <div className="flex justify-center">
                <div className={`p-4 rounded-full border ${
                  isForcedActive && simulatedVersionCode < versionCode
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : simulatedVersionCode < versionCode
                    ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <ShieldAlert size={32} />
                </div>
              </div>

              {simulatedVersionCode < versionCode ? (
                isForcedActive ? (
                  // Force Update View
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white">⚠ Update Required</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Your current FloatDock installation (Code {simulatedVersionCode}) is no longer supported by backend nodes. You must download and install the latest APK to continue using the overlay services.
                    </p>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-white/5 text-left text-[11px] text-slate-400 space-y-1 mt-2">
                      <p className="font-bold text-slate-200">Release Changelog:</p>
                      <p>{settings?.version?.description || 'Bug fixes & layout optimization.'}</p>
                    </div>
                    <div className="pt-4 space-y-2">
                      <a
                        href="/api/download-apk"
                        className="w-full block text-center bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-red-600/25"
                      >
                        ⬇ Download Required Update Now
                      </a>
                    </div>
                  </div>
                ) : (
                  // Normal Update view
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white">🆕 Update Available</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      FloatDock v{versionName} is now available! This release features critical optimizations for overlay frames and transparency triggers.
                    </p>
                    <div className="bg-slate-950 p-3 rounded-2xl border border-white/5 text-left text-[11px] text-slate-400 space-y-1 mt-2">
                      <p className="font-bold text-slate-200 font-mono">Changelog:</p>
                      <p>{settings?.version?.description}</p>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button
                        onClick={() => setShowSimulatedUpdateAlert(false)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold py-3 rounded-xl text-xs transition"
                      >
                        Later
                      </button>
                      <a
                        href="/api/download-apk"
                        className="flex-1 text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition"
                      >
                        Download Update
                      </a>
                    </div>
                  </div>
                )
              ) : (
                // Up to date view
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">✓ App Up To Date</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your simulated connection is running Version Code <strong>{simulatedVersionCode}</strong>. No update is required.
                  </p>
                  <button
                    onClick={() => setShowSimulatedUpdateAlert(false)}
                    className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-semibold py-3 rounded-xl text-xs transition mt-4"
                  >
                    Close Simulator
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <NavBar currentView={view} setView={setView} versionName={versionName} />

      {/* View router with fade-in effect */}
      <div className="flex-1">
        
        {/* ========================================================= */}
        {/* VIEW 1: HOME PAGE                                         */}
        {/* ========================================================= */}
        {view === 'home' && (
          <div className="space-y-16 py-12 md:py-20 animate-fade-in select-none">
            
            {/* Hero Split Header */}
            <header className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  <Sparkles size={11} className="animate-pulse" /> Android Ergonomics Redefined
                </span>
                
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                  {settings?.home_hero?.home_tagline || 'Supercharge Your Android Screen With a Smart, Fluid Dock'}
                </h2>

                <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
                  {settings?.home_hero?.home_description || 'Access favorite shortcuts, speed-dials, system widgets, and float calculations with a single swipe.'}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <button
                    onClick={() => setView('download')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-4 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25"
                  >
                    <Download size={14} /> Download APK (Direct)
                  </button>

                  <button
                    onClick={() => setView('features')}
                    className="border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 font-bold px-6 py-4 rounded-xl text-xs uppercase tracking-wider transition"
                  >
                    Explore Core Features
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <Check size={14} className="text-emerald-500" />
                    <span>Battery Friendly (0% wake idle)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check size={14} className="text-emerald-500" />
                    <span>No Root Required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check size={14} className="text-emerald-500" />
                    <span>No ads</span>
                  </div>
                </div>
              </div>

              {/* High-fidelity interactive Sandbox Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full -z-10"></div>
                  <PhoneMockup />
                </div>
              </div>
            </header>

            {/* Bento Grid Features teaser */}
            <section className="bg-slate-900/40 border-y border-white/5 py-16 px-6">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black tracking-tight text-white">Why Choose FloatDock?</h3>
                  <p className="text-sm text-slate-400 max-w-lg mx-auto">Engineered to bring physical accessibility shortcuts and fluid multi-window drawers to modern displays.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-950 border border-white/5 rounded-3xl space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/10 font-bold">
                      <Sliders size={16} />
                    </div>
                    <h4 className="font-bold text-white text-base">Fully Customized Triggers</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Adjust height positions, triggers widths, translucent levels, and colors to harmonize with your desktop wall covers.</p>
                  </div>

                  <div className="p-6 bg-slate-950 border border-white/5 rounded-3xl space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/10 font-bold">
                      <Grid size={16} />
                    </div>
                    <h4 className="font-bold text-white text-base">Quick-Launch Hotbar</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Map up to 16 launcher app shortcuts, custom speed dials, and direct accessibility tools to operate single-handedly.</p>
                  </div>

                  <div className="p-6 bg-slate-950 border border-white/5 rounded-3xl space-y-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/10 font-bold">
                      <Calculator size={16} />
                    </div>
                    <h4 className="font-bold text-white text-base">Overlay Desktop Widgets</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Open a quick floating calculator, look at upcoming calendar schedules, and command screen luminosities instantly.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: FEATURES                                          */}
        {/* ========================================================= */}
        {view === 'features' && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-fade-in select-none">
            <header className="space-y-4 max-w-2xl">
              <h2 className="text-4xl font-black tracking-tight text-white">Full Feature Suit</h2>
              <p className="text-base text-slate-400">Discover how FloatDock leverages native Android system APIs to construct a seamless productivity drawer overlay.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                {/* Point 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 flex items-center justify-center font-bold">1</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">Dual-Pass Downscaled Blur Shaders</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Unlike basic overlays that lag, FloatDock renders real-time frosted glass blurs at 60FPS, giving an ultra-premium aesthetic without processing throttles.</p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 flex items-center justify-center font-bold">2</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">Physical Navigation Triggers</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Integrate accessibility coordinates. Single tap back commands, scroll shades, trigger system recents list, or shut screens with ease.</p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 flex items-center justify-center font-bold">3</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">No Data Permissions Telemetry</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">FloatDock operates entirely on-device, preserving zero logs, keystroke buffers, or telemetry databases to ensure total privacy safeguards.</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl relative">
                <div className="absolute top-4 left-4 text-[10px] text-slate-500 font-mono">Sandbox Demo Panel</div>
                <PhoneMockup />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: DOWNLOAD PAGE                                     */}
        {/* ========================================================= */}
        {view === 'download' && (
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-fade-in select-none">
            <div className="bg-slate-900 border border-white/5 p-8 md:p-12 rounded-[40px] text-center space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-indigo-500/0 -z-10"></div>
              
              <div className="mx-auto w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-600/35">
                FD
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-black text-white">Get FloatDock APK</h2>
                <p className="text-sm text-indigo-400 font-semibold uppercase tracking-wider">Active Stable Release: v{versionName} (Build {versionCode})</p>
              </div>

              <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Download the official compiled installer package directly. Swap older files safely without losing personal layout panels or custom mapped widgets.
              </p>

              {/* Download Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/api/download-apk"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-2xl shadow-indigo-600/25"
                >
                  <Download size={14} /> Download Direct APK
                </a>
                
                <button
                  onClick={() => setView('how-to-install')}
                  className="w-full sm:w-auto px-8 py-4 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 font-bold rounded-xl text-xs uppercase tracking-wider transition"
                >
                  Installation Guide
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 text-left text-xs text-slate-400 space-y-1 max-w-lg mx-auto">
                <span className="font-bold text-slate-200">What&apos;s New in v{versionName}:</span>
                <p className="leading-relaxed text-[11px]">{settings?.version?.description}</p>
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-[10px] text-slate-500 font-mono">
                <span>File: FloatDock.apk</span>
                <span>•</span>
                <span>Type: Android Overlay App</span>
                <span>•</span>
                <span>Require: Android 8.0+</span>
                <span>•</span>
                <span>License: Open Source Free</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: SCREENSHOTS / GALLERY                             */}
        {/* ========================================================= */}
        {view === 'screenshots' && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-fade-in select-none">
            <header className="space-y-3 max-w-lg">
              <h2 className="text-4xl font-black tracking-tight text-white">Visual Showcase</h2>
              <p className="text-sm text-slate-400">Discover our modular glassmorphism layout, settings panel options, and multi-app speed docks.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {settings?.screenshots?.map((snap) => (
                <div key={snap.id} className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden p-4 space-y-4 hover:border-indigo-500/20 transition">
                  <div className="aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border border-white/5">
                    <img 
                      src={snap.url} 
                      alt={snap.title} 
                      className="w-full h-full object-cover select-none" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1.5 px-1">
                    <h4 className="font-bold text-white text-sm">{snap.title}</h4>
                    <p className="text-xs text-slate-400 leading-normal">{snap.caption || 'Active floating trigger viewport layout.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 5: HOW TO INSTALL                                    */}
        {/* ========================================================= */}
        {view === 'how-to-install' && (
          <div className="max-w-3xl mx-auto px-6 py-12 space-y-10 animate-fade-in select-none">
            <header className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight text-white">How To Install APK</h2>
              <p className="text-base text-slate-400">Because FloatDock utilizes custom system triggers, follow these 3 simple installation commands.</p>
            </header>

            <div className="space-y-6">
              <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/10 flex items-center justify-center font-black text-sm">1</div>
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-base">Step 1: Download & Open</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Click "Download FloatDock APK" to receive the system installer package. Tap on the notifications prompt to open the package manager.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/10 flex items-center justify-center font-black text-sm">2</div>
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-base">Step 2: Permit Unknown Installers</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    If prompted, authorize Chrome or your file manager to install packages from "Unknown Sources". Rest assured, FloatDock has passed all Play Protect signatures.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/10 flex items-center justify-center font-black text-sm">3</div>
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-base">Step 3: Overlay System Grants</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Once inside FloatDock, grant "Draw over other apps" settings to render the trigger bubble, and the optional "Accessibility service" settings if you command back swipe controls.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-emerald-500/0 border border-emerald-500/10 rounded-3xl flex items-center gap-3">
              <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
              <p className="text-xs text-emerald-200">Installation completes! You are ready to swipe-open your floating shortcuts.</p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 6: FAQ GRID                                          */}
        {/* ========================================================= */}
        {view === 'faq' && (
          <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-fade-in select-none">
            <header className="space-y-4 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-black tracking-tight text-white">Frequently Asked Questions</h2>
              <p className="text-sm text-slate-400">Everything you need to know about FloatDock system blurs, battery optimizations, and safe overlay triggers.</p>
            </header>

            <div className="space-y-4">
              {settings?.faqs?.map((faq) => (
                <div key={faq.id} className="p-6 bg-slate-900 border border-white/5 rounded-3xl space-y-2">
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <HelpCircle size={16} className="text-indigo-400" /> {faq.question}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed pl-6">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 7: ABOUT                                             */}
        {/* ========================================================= */}
        {view === 'about' && (
          <div className="max-w-3xl mx-auto px-6 py-12 space-y-12 animate-fade-in select-none">
            <header className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight text-white">About FloatDock</h2>
              <p className="text-sm text-indigo-400 font-bold uppercase tracking-wider">Empowering Android Screen Accessibility Shortcuts</p>
            </header>

            <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm md:text-base leading-relaxed">
              <p>{settings?.about_page?.description || 'FloatDock reclaims ergonomics on modern displays.'}</p>
              <p>{settings?.about_page?.developer_info || 'Developed with love by the FloatDock Team.'}</p>
            </div>

            <div className="p-6 bg-slate-900 border border-white/5 rounded-[30px] flex flex-col md:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-xl flex-shrink-0">
                FD
              </div>
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-bold text-white text-base">Join the Open-Source Team</h4>
                <p className="text-xs text-slate-400">We welcome community pull requests on floating calculator widgets, overlay translations, and shortcuts layout grids.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 8: BLOG ARTICLES CATALOG                             */}
        {/* ========================================================= */}
        {view === 'blog' && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-fade-in select-none">
            
            {activeBlog ? (
              <BlogDetail post={activeBlog} onBack={() => setActiveBlog(null)} />
            ) : (
              <>
                <header className="space-y-4 max-w-2xl">
                  <h2 className="text-4xl font-black tracking-tight text-white">Product Blog Articles</h2>
                  <p className="text-base text-slate-400">Read deep dives on smartphone ergonomics, hardware-backed glassmorphism blurs, and sandboxed Android permissions.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {settings?.blog_posts?.map((post) => (
                    <div 
                      key={post.id} 
                      onClick={() => setActiveBlog(post)}
                      className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4 hover:border-indigo-500/20 cursor-pointer transition flex flex-col justify-between h-full"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span className="uppercase tracking-widest text-indigo-400">{post.category || 'Product'}</span>
                          <span>{post.read_time || '5 min read'}</span>
                        </div>
                        <h4 className="font-black text-white text-lg leading-snug group-hover:text-indigo-400 transition">{post.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed truncate-2-lines">{post.excerpt}</p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[11px] text-slate-400">
                        <span>By {post.author || 'Admin'}</span>
                        <span className="text-indigo-400 font-bold flex items-center gap-1">Read Post <ArrowRight size={12} /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 9: CONTACT US                                        */}
        {/* ========================================================= */}
        {view === 'contact' && (
          <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in select-none">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-4xl font-black tracking-tight text-white">Contact Developers</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Have questions regarding overlay compatibility on customized MIUI, Realme, or OxygenOS platforms? Drop us a coordinate, and our administrator dashboard will review your logs.
                </p>

                <div className="p-5 bg-slate-900 border border-white/5 rounded-2xl text-xs space-y-3 text-slate-400">
                  <p><strong>Admin Panel Response:</strong> Within 12-24 hours.</p>
                  <p><strong>Repository Location:</strong> same repo <code>floatdock-website</code></p>
                  <p><strong>Security Guidelines:</strong> Please never submit sensitive private security keys or credentials via contact forms.</p>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-900 border border-white/5 p-6 md:p-8 rounded-[30px]">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="John Doe"
                        className="mt-1.5 block w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="john@example.com"
                        className="mt-1.5 block w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Inbound Subject</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="e.g. Android 13 Compatibility Request"
                      className="mt-1.5 block w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Detailed Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Type your message description here..."
                      className="mt-1.5 block w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm"
                    />
                  </div>

                  {contactStatus && (
                    <div className={`p-4 rounded-xl text-xs font-semibold ${
                      contactStatus.type === 'success' 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                      {contactStatus.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg disabled:opacity-50"
                  >
                    {contactSubmitting ? 'Sending Request...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 10: LEGAL PRIVACY POLICY                             */}
        {/* ========================================================= */}
        {view === 'privacy' && (
          <div className="max-w-3xl mx-auto px-6 py-12 space-y-6 animate-fade-in select-none">
            <h2 className="text-3xl font-black text-white">Privacy Policy</h2>
            <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-xs md:text-sm leading-relaxed">
              <p><strong>Last Updated: July 2026</strong></p>
              <p>This Privacy Policy outlines how FloatDock collects, processes, and protects information of our website visitors and companion application users. By installing the FloatDock APK, you agree to these privacy clauses.</p>
              <h4 className="font-bold text-white text-sm mt-4 uppercase tracking-wider text-indigo-400">1. On-Device Sandboxing Policy</h4>
              <p>FloatDock is built strictly on an offline-first architecture. Any custom application shortcuts, accessibility coordinates, theme parameters, or overlay sizes that you map inside the app are stored inside local sandboxed files on your phone. This data is never synchronized, uploaded, or transmitted to any remote servers, including our own administrator nodes.</p>
              <h4 className="font-bold text-white text-sm mt-4 uppercase tracking-wider text-indigo-400">2. Draw Over Other Apps & Accessibility permissions</h4>
              <p>To render the translucent trigger handle (or bubble) on the side edge, the companion app requests the "Display over other apps" overlay flag. To coordinate physical back swiping, home press, or notifications pulling, the app requests the standard Accessibility API. FloatDock only reads coordinates when you actively tap the trigger bubble. It does not monitor background screen states or keystrokes.</p>
              <h4 className="font-bold text-white text-sm mt-4 uppercase tracking-wider text-indigo-400">3. Website Inbound Requests</h4>
              <p>If you submit queries via our Contact page, the Name, Email, and message that you input are stored inside our secure Node JSON database strictly to coordinate support. We do not sell or lease this contact list to third-party advertisers or services.</p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 11: TERMS AND CONDITIONS                             */}
        {/* ========================================================= */}
        {view === 'terms' && (
          <div className="max-w-3xl mx-auto px-6 py-12 space-y-6 animate-fade-in select-none">
            <h2 className="text-3xl font-black text-white">Terms & Conditions</h2>
            <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-xs md:text-sm leading-relaxed">
              <p><strong>Last Updated: July 2026</strong></p>
              <p>Welcome to FloatDock! These terms govern your use of the FloatDock website, our admin management panel, and the compiled Android packages downloaded from our nodes.</p>
              <h4 className="font-bold text-white text-sm mt-4 uppercase tracking-wider text-indigo-400">1. Acceptable APK Use and Upgrades</h4>
              <p>FloatDock packages are distributed for individual productivity optimizations. Users may download FloatDock.apk freely. You may not decompile, reverse engineer, or repackage FloatDock with commercial third-party ads without official developer authorization.</p>
              <h4 className="font-bold text-white text-sm mt-4 uppercase tracking-wider text-indigo-400">2. Force Update Acknowledgement</h4>
              <p>To preserve secure, performant operations on customized Android platforms, our administrator panel reserves the authority to trigger Force Update flags. If active, you acknowledge that access to older companion app builds may be blocked until you synchronize the build to the latest semantic APK version.</p>
              <h4 className="font-bold text-white text-sm mt-4 uppercase tracking-wider text-indigo-400">3. Termination of Service</h4>
              <p>The administrators reserve the right to suspend direct download APK nodes or support inbox portals at any time, for any reason, without prior notice.</p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 12: GENERAL DISCLAIMER                               */}
        {/* ========================================================= */}
        {view === 'disclaimer' && (
          <div className="max-w-3xl mx-auto px-6 py-12 space-y-6 animate-fade-in select-none">
            <h2 className="text-3xl font-black text-white">Disclaimer</h2>
            <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-xs md:text-sm leading-relaxed">
              <p><strong>Last Updated: July 2026</strong></p>
              <p>Please read this disclaimer carefully before downloading or using the FloatDock Android companion application.</p>
              <h4 className="font-bold text-white text-sm mt-4 uppercase tracking-wider text-indigo-400">1. No Warranty & "As-Is" Distribution</h4>
              <p>FloatDock is provided on an "as-is" and "as-available" basis. We offer no guarantees that the overlay trigger services will function without interruption on customized Android distributions (such as Samsung One UI, Xiaomi MIUI/HyperOS, Oppo ColorOS, or Realme UI) which incorporate aggressive background task termination algorithms.</p>
              <h4 className="font-bold text-white text-sm mt-4 uppercase tracking-wider text-indigo-400">2. Limitation of Liability</h4>
              <p>Under no circumstances shall FloatDock developers or administrators be liable for any device issues, application freezes, system crashes, or data storage corruptions resulting from granting overlay display permissions or accessibility coordinates to the companion app.</p>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <Footer setView={setView} developerInfo={settings?.about_page?.developer_info || ''} />

    </div>
  );
}
