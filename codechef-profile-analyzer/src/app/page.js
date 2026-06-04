'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Search, User, Award, Globe, CheckCircle, TrendingUp, AlertTriangle, BookOpen, Clock } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/analyze?username=${username}`);
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Search Section */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold text-amber-500 tracking-tight">CodeChef Profile Analyzer</h1>
          <p className="text-slate-400">Get deep visual analytics, track ratings trends, and discover weaknesses.</p>
          
          <form onSubmit={handleSearch} className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter CodeChef Handle (e.g., tourist)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500 text-slate-200"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg transition"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
          {error && <p className="text-red-400 font-medium text-sm">{error}</p>}
        </div>

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            
            {/* Left Box: Identity */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col items-center text-center justify-center">
              <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-amber-500 text-3xl font-bold mb-4">
                {data.stars} ★
              </div>
              <h2 className="text-2xl font-bold">{data.name}</h2>
              <p className="text-slate-400 mb-4">@{data.username}</p>
              <div className="flex gap-4 border-t border-slate-700 pt-4 w-full justify-around">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Current Rating</p>
                  <p className="text-xl font-bold text-amber-400">{data.currentRating}</p>
                </div>
                <div className="border-l border-slate-700"></div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Max Rating</p>
                  <p className="text-xl font-bold text-emerald-400">{data.maxRating}</p>
                </div>
              </div>
            </div>

            {/* Core Stats Overview Cards */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                <Globe className="text-blue-400 w-6 h-6 mb-2" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">Global Rank</p>
                  <p className="text-2xl font-bold">{data.globalRank}</p>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                <Award className="text-indigo-400 w-6 h-6 mb-2" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">Country Rank ({data.country})</p>
                  <p className="text-2xl font-bold">{data.countryRank}</p>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                <CheckCircle className="text-emerald-400 w-6 h-6 mb-2" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">Problems Solved</p>
                  <p className="text-2xl font-bold">{data.problemsSolved}</p>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                <Clock className="text-purple-400 w-6 h-6 mb-2" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">Avg Contest Rank</p>
                  <p className="text-2xl font-bold">{data.averageRank}</p>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                <TrendingUp className="text-cyan-400 w-6 h-6 mb-2" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">Improvement Trend</p>
                  <p className="text-xl font-bold text-cyan-400">{data.improvementTrend}</p>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                <User className="text-amber-400 w-6 h-6 mb-2" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">Best Performance</p>
                  <p className="text-xl font-bold text-amber-400">{data.bestPerformance}</p>
                </div>
              </div>
            </div>

            {/* Rating Progression Graph Chart */}
            <div className="md:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold mb-4">Rating Graph & Contest History</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.ratingGraph}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                    <Line type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Breakdown of Solved Problems by Difficulty */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold mb-4">Problems Solved by Rating</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.problemsByRating}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Advanced Smart Logic: Analytics & Weaknesses */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <BookOpen className="w-5 h-5" />
                <h3>Topic Analysis</h3>
              </div>
              <div className="space-y-3">
                {data.topicAnalysis.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{item.topic}</span>
                      <span className="text-slate-400">{item.weight}% efficiency</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${item.weight}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <h3>Weakness Identification</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                {data.weaknesses.map((weakness, i) => (
                  <li key={i} className="flex items-center gap-2 bg-red-950/40 p-2 rounded border border-red-900/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    Critical focus required: <strong>{weakness}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <TrendingUp className="w-5 h-5" />
                <h3>Roadmap for Improvement</h3>
              </div>
              <ol className="space-y-3 text-sm text-slate-300 list-decimal pl-4">
                {data.roadmap.map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Recent Solved Submissions Feed */}
            <div className="md:col-span-3 bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold mb-4">Recent Solves & Submissions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.recentSolves.map((prob, i) => (
                  <a
                    key={i}
                    href={prob.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-amber-500/50 transition flex items-center justify-between text-sm group"
                  >
                    <span className="text-slate-200 group-hover:text-amber-400 truncate max-w-[80%]">{prob.name}</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Solved</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}