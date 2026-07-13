import React from 'react';
import { Sliders, Shield, Menu, X, Download } from 'lucide-react';

interface NavBarProps {
  currentView: string;
  setView: (view: any) => void;
  versionName: string;
}

export default function NavBar({ currentView, setView, versionName }: NavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'screenshots', label: 'Screenshots' },
    { id: 'how-to-install', label: 'Install' },
    { id: 'faq', label: 'FAQ' },
    { id: 'blog', label: 'Blog' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 select-none">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => { setView('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/35 group-hover:scale-105 transition">
            FD
          </div>
          <span className="font-black text-lg tracking-tight text-white group-hover:text-indigo-400 transition">
            FloatDock
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setView(link.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                currentView === link.id 
                  ? 'bg-indigo-600/10 text-indigo-400 font-extrabold border border-indigo-500/10' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setView('admin')}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition"
          >
            <Shield size={13} /> Admin Panel
          </button>

          <button
            onClick={() => setView('download')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
          >
            <Download size={13} />
            <span>Download APK</span>
            {versionName && (
              <span className="bg-indigo-800 text-indigo-200 text-[9px] px-1.5 py-0.5 rounded-md border border-indigo-500/25">
                v{versionName}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setView('admin')}
            className="text-slate-400 hover:text-indigo-400 transition"
          >
            <Shield size={16} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Links Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-slate-900 border-b border-white/5 p-4 flex flex-col gap-1 shadow-2xl animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { setView(link.id); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl transition ${
                currentView === link.id 
                  ? 'bg-indigo-600/10 text-indigo-400 font-extrabold' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="border-t border-white/5 mt-2 pt-3 flex flex-col gap-2">
            <button
              onClick={() => { setView('download'); setMobileMenuOpen(false); }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> Download APK (v{versionName})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
