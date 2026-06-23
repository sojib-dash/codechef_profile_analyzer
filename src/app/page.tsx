'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  const platforms = [
    {
      name: 'CodeChef',
      slug: '/codechef',
      description: 'Analyze submission heatmaps, star progression tiers, and customized execution roadmaps.',
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
      status: 'Active'
    },
    {
      name: 'Codeforces',
      slug: '#',
      description: 'Track rating subdivisions, contest rank shifts, and performance histograms.',
      color: 'from-blue-500 to-cyan-600',
      badgeColor: 'text-slate-400 bg-slate-800 border-slate-700',
      status: 'Coming Soon'
    },
    {
      name: 'LeetCode',
      slug: '#',
      description: 'Evaluate interview preparation progress tracks and structured DSA module distribution patterns.',
      color: 'from-yellow-500 to-amber-600',
      badgeColor: 'text-slate-400 bg-slate-800 border-slate-700',
      status: 'Coming Soon'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full space-y-12">
        
        {/* Header Title Block */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            CP Profile Analytics Suite
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Select a competitive programming framework ecosystem below to begin deep-telemetry parsing and execution tracking.
          </p>
        </header>

        {/* Platform Option Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((platform, idx) => {
            const isAvailable = platform.status === 'Active';
            
            // Core Interactive Card Structure
            const CardContent = (
              <div className={`h-full bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 relative flex flex-col justify-between ${
                isAvailable ? 'hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer' : 'opacity-60 select-none'
              }`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} opacity-20 absolute top-6 left-6 blur-lg`} />
                    <h2 className="text-xl font-bold text-slate-100 tracking-tight z-10">{platform.name}</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${platform.badgeColor}`}>
                      {platform.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{platform.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-950/40 flex items-center text-xs font-semibold group">
                  {isAvailable ? (
                    <span className="text-orange-400 flex items-center gap-1">
                      Launch Analyzer <span>→</span>
                    </span>
                  ) : (
                    <span className="text-slate-500">Pipeline Locked</span>
                  )}
                </div>
              </div>
            );

            return isAvailable ? (
              <Link key={idx} href={platform.slug}>
                {CardContent}
              </Link>
            ) : (
              <div key={idx}>{CardContent}</div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
