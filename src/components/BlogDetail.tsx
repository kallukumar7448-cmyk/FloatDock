import React from 'react';
import { BlogPost } from '../types';
import { Calendar, User, Tag, Clock, ArrowLeft } from 'lucide-react';

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
}

export default function BlogDetail({ post, onBack }: BlogDetailProps) {
  return (
    <article className="max-w-3xl mx-auto py-12 px-6 select-none animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="group mb-8 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Blog Articles</span>
      </button>

      {/* Article Header */}
      <header className="space-y-6">
        <span className="inline-block bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          {post.category || 'Product'}
        </span>
        
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
          {post.title}
        </h1>

        <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
          {post.excerpt}
        </p>

        {/* Article Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-y border-white/5 py-4">
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-indigo-400" />
            <span>By <strong>{post.author || 'Admin'}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <Calendar size={14} className="text-indigo-400" />
            <span>{post.date}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-indigo-400" />
            <span>{post.read_time || '5 min read'}</span>
          </div>
        </div>
      </header>

      {/* Article Content Body */}
      <main className="mt-8 prose prose-invert max-w-none text-slate-300 space-y-6 text-sm md:text-base leading-relaxed">
        {post.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="whitespace-pre-line leading-relaxed">
            {paragraph}
          </p>
        ))}
      </main>

      {/* Helpful alert card */}
      <div className="mt-12 p-6 bg-slate-900 border border-white/5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-bold text-white text-sm">Experience FloatDock on your own Android!</h4>
          <p className="text-xs text-slate-400">Tweak shortcuts and bubbles in high-performance glassmorphism blurs.</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition"
        >
          Download Direct APK
        </button>
      </div>
    </article>
  );
}
