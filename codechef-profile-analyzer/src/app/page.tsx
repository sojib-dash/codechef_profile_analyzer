'use client';

import { useState } from 'react';
import { 
  Search, User, Award, Globe, BookOpen, TrendingUp, AlertTriangle, 
  Map, History, BarChart3, CheckCircle2, XCircle, Star, ShieldAlert 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';

export default function Home() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/analyze?username=${encodeURIComponent(username)}`);
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError(result.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError('Connection failure updating telemetry data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header section */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500">
          CodeChef Profile Analyzer
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
          Enter any CodeChef username to run detailed telemetry diagnostics, code execution metrics, and roadmap metrics.
        </p>
      </div>

      {/* Input Search Console */}
      <form onSubmit={fetchAnalysis} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Try 'chef_master' or any user..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {error && (
        <div className="max-w-md mx-auto bg-red-950/40 border border-red-900 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analytics Data Board */}
      {data && (
        <div className="space-y-6 animate-fade-in">
          {/* Dashboard Summary Row Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Rating & Rank</span>
                <Award className="w-4 h-4 text-orange-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{data.profile.currentRating}</span>
                <span className="text-xs bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded font-mono">{data.profile.stars}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Peak: {data.profile.maxRating}</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Global Rank</span>
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">#{data.profile.globalRank.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Country Rank: #{data.profile.countryRank.toLocaleString()} ({data.profile.country})</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Problems Solved</span>
                <BookOpen className="w-4 h-4 text-green-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">{data.profile.problemsSolved}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Avg Contest Rank: {data.profile.avgRank}</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-start text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Trend Outlook</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold block truncate text-purple-300">{data.improvementTrend}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 truncate">Best: {data.profile.bestPerformance}</p>
            </div>
          </div>

          {/* Graphics Plots Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Evolution Line Chart */}
            <div className="bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-800">
              <h3 className="text-base font-bold text-slate-300 mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-orange-500" /> Contest Rating Graph
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.contestHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 100', 'dataMax + 100']} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Line type="monotone" dataKey="rating" stroke="#ea580c" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Solved Distribution Bar Chart */}
            <div className="bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-800">
              <h3 className="text-base font-bold text-slate-300 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-500" /> Problems Solved by Rating Bracket
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="ratingRange" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Deep Topics & Diagnostic Pipeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Topic Tracking metrics */}
            <div className="bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-800 md:col-span-2">
              <h3 className="text-base font-bold text-slate-300 mb-4">Topic Accuracy Vector Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase bg-slate-950 text-slate-400 font-mono">
                    <tr>
                      <th className="p-3">Topic Core Domain</th>
                      <th className="p-3 text-center">Solves Count</th>
                      <th className="p-3 text-center">Accuracy Trend</th>
                      <th className="p-3 text-right">Status Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {data.topicAnalysis.map((topic: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="p-3 font-medium">{topic.topic}</td>
                        <td className="p-3 text-center font-mono">{topic.count}</td>
                        <td className="p-3 text-center font-mono">{topic.successRate}%</td>
                        <td className="p-3 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${
                            topic.status === 'Strong' ? 'bg-green-500/10 text-green-400' :
                            topic.status === 'Proficient' ? 'bg-blue-500/10 text-blue-400' :
                            topic.status === 'Needs Practice' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {topic.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Diagnostics & Weakness Analysis Block */}
            <div className="space-y-4">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Core Weakness Flagged
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.weaknesses.map((weakness: string, index: number) => (
                    <span key={index} className="bg-red-500/10 border border-red-900/50 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic Curated Practice Pathway Map */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <Map className="w-4 h-4 text-orange-500" /> Strategic Scaling Roadmap
                </h4>
                <div className="space-y-3">
                  {data.roadmap.map((step: any, index: number) => (
                    <div key={index} className="text-xs border-l-2 border-slate-700 pl-3 space-y-1 py-0.5">
                      <p className="font-bold text-slate-200">{step.step}</p>
                      <p className="text-slate-400 leading-relaxed">{step.Action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submissions & Match History Feed Component */}
          <div className="bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-800">
            <h3 className="text-base font-bold text-slate-300 mb-4">Recent Solves & Submission Registry</h3>
            <div className="space-y-3">
              {data.recentSolves.map((solve: any, index: number) => (
                <div key={index} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800/60 text-sm">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-200">{solve.problemName}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono font-medium">{solve.problemCode}</span>
                      <span>Difficulty Rating: {solve.rating}</span>
                      <span>• {solve.time}</span>
                    </div>
                  </div>
                  <div>
                    {solve.status === 'Accepted' ? (
                      <span className="flex items-center gap-1 text-green-400 font-medium text-xs bg-green-500/10 px-2 py-1 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" /> AC
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 font-medium text-xs bg-red-500/10 px-2 py-1 rounded">
                        <XCircle className="w-3.5 h-3.5" /> WA
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
