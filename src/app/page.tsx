'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Award, Globe, Flag, Activity, CheckCircle, TrendingUp, AlertTriangle, Compass, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalysis = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await fetch(`/api/analyze?username=${username}`);
      if (!res.ok) {
        throw new Error('Profile data sync failed');
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Data sync processing exception');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Search Header Banner */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-amber-400">⚡ CODECHEF PROFILE ANALYZER</h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm">Compute automated analytics, metric tracking indices, and strategic training roadmaps.</p>
        <div className="flex max-w-md mx-auto gap-2">
          <input
            type="text"
            placeholder="Enter CodeChef Handle..."
            className="bg-slate-900 text-white border border-slate-600 px-4 py-2 rounded-xl flex-grow focus:outline-none focus:border-amber-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button 
            onClick={fetchAnalysis}
            disabled={loading}
            className="bg-amber-500 text-slate-950 font-bold px-6 py-2 rounded-xl hover:bg-amber-400 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>}
      </div>

      {data && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Metadata Display Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center space-x-4">
              <Award className="text-amber-400 w-10 h-10" />
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">User Star Status</p>
                <h3 className="text-xl font-bold">{data.username} ({data.stars})</h3>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center space-x-4">
              <Activity className="text-emerald-400 w-10 h-10" />
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Rating (Current / Peak)</p>
                <h3 className="text-xl font-bold text-emerald-400">{data.currentRating} <span className="text-xs text-slate-500">/ {data.highestRating}</span></h3>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center space-x-4">
              <Globe className="text-blue-400 w-10 h-10" />
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Global Rank</p>
                <h3 className="text-xl font-bold">#{data.globalRank}</h3>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center space-x-4">
              <Flag className="text-purple-400 w-10 h-10" />
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Country Rank</p>
                <h3 className="text-xl font-bold">#{data.countryRank}</h3>
              </div>
            </div>
          </div>

          {/* Core Analytics Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Computed Metric Stats Engine Block */}
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-4">
              <h2 className="text-lg font-bold border-b border-slate-700 pb-2 text-amber-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5"/> Telemetry & Derived Stats
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Problems Solved:</span> <span className="font-semibold text-white">{data.problemsSolved}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Average Contest Rank:</span> <span className="font-semibold text-white">{data.averageRank}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Best Performance:</span> <span className="font-semibold text-emerald-400 text-right text-xs max-w-[180px] truncate">{data.bestContestPerformance}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Improvement Trend:</span> <span className="font-bold text-blue-400">{data.improvementTrend}</span></div>
              </div>
            </div>

            {/* Smart Roadmap Engine */}
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold border-b border-slate-700 pb-2 text-indigo-400 flex items-center gap-2">
                <Compass className="w-5 h-5"/> Tactical Training Roadmap
              </h2>
              <ul className="space-y-2 text-sm">
                {data.roadmap.map((step: string, idx: number) => (
                  <li key={idx} className="bg-slate-900 p-2 rounded border-l-4 border-indigo-500 text-slate-300">✅ {step}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Graphs Visualization Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Rating Chart */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h3 className="text-sm font-bold mb-3 text-slate-300 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400"/> Interactive Rating Trend Over Time</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.contestHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 100', 'dataMax + 100']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                    <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={3} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* --- 6/6/2026 --- */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                ⏱️ Platform Consistency & Activity Engine
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg">
                  <p className="text-xs text-slate-400 font-medium">Active Days (Last 30d)</p>
                  <p className="text-3xl font-extrabold text-amber-500 mt-1">{data.consistency.daysActive30} <span className="text-xs font-normal text-slate-500">days</span></p>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg">
                  <p className="text-xs text-slate-400 font-medium">Active Days (Last 90d)</p>
                  <p className="text-3xl font-extrabold text-orange-500 mt-1">{data.consistency.daysActive90} <span className="text-xs font-normal text-slate-500">days</span></p>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg">
                  <p className="text-xs text-slate-400 font-medium">Solving Streak</p>
                  <p className="text-3xl font-extrabold text-red-500 mt-1">{data.consistency.currentStreak} <span className="text-xs font-normal text-slate-500">current / {data.consistency.maxStreak} max</span></p>
                </div>
                <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg">
                  <p className="text-xs text-slate-400 font-medium">Velocity Average</p>
                  <p className="text-3xl font-extrabold text-cyan-400 mt-1">{data.consistency.averageProblemsPerWeek} <span className="text-xs font-normal text-slate-500">probs/wk</span></p>
                </div>
              </div>
            </div>
            {/* ------------ 6/6/2026 ---------- */}
            
            {/* Difficulty Mapping Histogram */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h3 className="text-sm font-bold mb-3 text-slate-300 flex items-center gap-2"><Activity className="w-4 h-4 text-amber-400"/> Problem Solved Distribution by Rating Band</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.problemsSolvedOverview}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                    <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Topic Arrays & Weakness Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 lg:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">📚 Topic Mastery & Algorithmic Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-400">
                  <thead className="bg-slate-900 text-slate-300 uppercase font-mono">
                    <tr>
                      <th className="p-3">Topic / Tag</th>
                      <th className="p-3">Solved Count</th>
                      <th className="p-3">Accuracy Metric</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {data.topicAnalyze.map((t: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-750">
                        <td className="p-3 font-medium text-white">{t.topic}</td>
                        <td className="p-3">{t.solved}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${t.accuracy > 70 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                            {t.accuracy}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Error Deficit Flags Card */}
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-3">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Volatile Deficit / Weaknesses</h3>
              <div className="flex flex-wrap gap-2">
                {data.weaknesses.map((w: string, i: number) => (
                  <span key={i} className="bg-rose-950/80 border border-rose-800 text-rose-300 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-400"/> {w}
                  </span>
                ))}
              </div>
              <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 mb-1">Recent Submissions History Log</h4>
                <div className="space-y-1 text-xs">
                  {data.recentSolves.map((s: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-slate-400 font-mono">
                      <span className="text-amber-400 truncate max-w-[120px]">{s.code}</span>
                      <span>{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
