import React from 'react';

interface FooterProps {
  setView: (view: any) => void;
  developerInfo: string;
}

export default function Footer({ setView, developerInfo }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12 px-6 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/25">
              FD
            </div>
            <span className="font-black text-base tracking-tight text-white">
              FloatDock
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The customizable multi-widget floating trigger drawer for Android device ergonomics and short launching.
          </p>
          <div className="text-[10px] text-slate-500 font-mono">
            © {currentYear} FloatDock Inc. All rights reserved.
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Discover Product</h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li><button onClick={() => setView('home')} className="hover:text-indigo-400 transition">Product Home</button></li>
            <li><button onClick={() => setView('features')} className="hover:text-indigo-400 transition">Design Features</button></li>
            <li><button onClick={() => setView('screenshots')} className="hover:text-indigo-400 transition">Screenshot Gallery</button></li>
            <li><button onClick={() => setView('how-to-install')} className="hover:text-indigo-400 transition">How to Install</button></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resources & Blog</h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li><button onClick={() => setView('blog')} className="hover:text-indigo-400 transition">Official Blog Articles</button></li>
            <li><button onClick={() => setView('faq')} className="hover:text-indigo-400 transition">Support & FAQ Grid</button></li>
            <li><button onClick={() => setView('contact')} className="hover:text-indigo-400 transition">Contact Developer</button></li>
            <li><button onClick={() => setView('admin')} className="hover:text-indigo-400 transition">Admin Console Login</button></li>
          </ul>
        </div>

        {/* Legal Policies (AdSense Approved targets) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal Compliance</h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li><button onClick={() => setView('privacy')} className="hover:text-indigo-400 transition">Privacy Policy</button></li>
            <li><button onClick={() => setView('terms')} className="hover:text-indigo-400 transition">Terms & Conditions</button></li>
            <li><button onClick={() => setView('disclaimer')} className="hover:text-indigo-400 transition">General Disclaimer</button></li>
          </ul>
          <p className="text-[10px] text-slate-500 leading-normal pt-2">
            {developerInfo || 'Developed with passion by the FloatDock Team.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
