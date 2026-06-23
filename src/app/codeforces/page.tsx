'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CodeforcesAnalyzer() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);

  const fetchCodeforcesData = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch(`/api/codeforces?username=${username}`);
      if (!res.ok) {
        throw new Error('Codeforces profile sync failed');
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err: any) {
      setError(err.message || 'API connection exception');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Title */}
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all">
            ← Back to Hub
          </Link>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Codeforces Live Engine
          </span>
        </div>

        <header className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Codeforces Rating Analyzer
          </h1>
          <p className="text-slate-400 text-xs">
            Direct telemetry sync with Codeforces server clusters.
          </p>
        </header>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-xl">
          <input
            type="text"
            placeholder="Enter Codeforces Handle..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
          />
          <button
            onClick={fetchCodeforcesData}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-semibold px-5 py-2 rounded-lg text-slate-950 disabled:opacity-50 transition-all text-sm"
          >
            {loading ? 'Fetching...' : 'Analyze'}
          </button>
        </div>

        {/* Error Block */}
        {error && (
          <div className="max-w-md mx-auto bg-red-950/40 border border-red-800 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Display Metrics Grid */}
        {data && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* User Info Header Card */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex items-center gap-4">
              <img 
                src={data.avatar} 
                alt={data.username} 
                className="w-16 h-16 rounded-lg object-cover border border-slate-700 bg-slate-950" 
              />
              <div>
                <h2 className="text-xl font-bold text-slate-100">{data.username}</h2>
                <p className="text-xs text-blue-400 capitalize font-medium mt-0.5">{data.rank} tier</p>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
                <p className="text-xs text-slate-400 font-medium uppercase">Current Rating</p>
                <p className="text-3xl font-black text-blue-400 mt-1">{data.currentRating}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
                <p className="text-xs text-slate-400 font-medium uppercase">Peak Max Rating</p>
                <p className="text-3xl font-black text-cyan-400 mt-1">{data.highestRating} <span className="text-xs font-normal text-slate-500">({data.maxRank})</span></p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
                <p className="text-xs text-slate-400 font-medium uppercase">Total Contests</p>
                <p className="text-2xl font-black text-amber-400 mt-1">{data.totalContests} <span className="text-xs font-normal text-slate-500">attended</span></p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
                <p className="text-xs text-slate-400 font-medium uppercase">Contest-Time Solves</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">{data.problemsSolvedInContestTime} <span className="text-xs font-normal text-slate-500">problems</span></p>
              </div>
            </div>
            {/* Performance Chart */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Official Rating Timeline Progression</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.contestHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 100', 'dataMax + 100']} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                    <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
