import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  // Real Production Note: In a live app, you would scrape or use a wrapper API to get data here.
  // This serves realistic structured mock data tailored specifically to CodeChef patterns.
  const mockDatabase: Record<string, any> = {
    "tourist": {
      username: "tourist", currentRating: 3105, maxRating: 3250, stars: "7★", globalRank: 1, countryRank: 1, country: "Belarus",
      problemsSolved: 1420, avgRank: 3.5, bestPerformance: "SnackDown Elite - 1st Place",
    },
    "chef_master": {
      username: "chef_master", currentRating: 1850, maxRating: 1920, stars: "4★", globalRank: 4210, countryRank: 850, country: "India",
      problemsSolved: 412, avgRank: 312, bestPerformance: "Starters 110 Division 2 - 14th Place",
    }
  };

  // Fallback generation logic for any arbitrary input username
  const profile = mockDatabase[username.toLowerCase()] || {
    username: username,
    currentRating: 1540,
    maxRating: 1610,
    stars: "3★",
    globalRank: 14205,
    countryRank: 3110,
    country: "Global",
    problemsSolved: 184,
    avgRank: 1240,
    bestPerformance: "Cook-Off Division 3 - 84th Place",
  };

  // 1. Contest History & Rating Graph Data
  const contestHistory = [
    { name: "Starters 100", rating: 1400, rank: 2500, solved: 2 },
    { name: "Cook-Off 122", rating: 1450, rank: 1800, solved: 3 },
    { name: "Starters 105", rating: 1420, rank: 3100, solved: 1 },
    { name: "Lunchtime 95", rating: 1510, rank: 940, solved: 4 },
    { name: "Starters 110", rating: profile.currentRating, rank: 1120, solved: 3 },
  ];

  // 2. Rating Breakdown Profile
  const ratingDistribution = [
    { ratingRange: "1000-1200", count: 45 },
    { ratingRange: "1200-1400", count: 72 },
    { ratingRange: "1400-1600", count: 50 },
    { ratingRange: "1600-1800", count: 14 },
    { ratingRange: "1800+", count: 3 },
  ];

  // 3. Advanced Tag Parsing Analytics
  const topicAnalysis = [
    { topic: "Arrays & Strings", count: 65, successRate: 88, status: "Strong" },
    { topic: "Math & Number Theory", count: 42, successRate: 74, status: "Proficient" },
    { topic: "Greedy Algorithms", count: 30, successRate: 61, status: "Needs Practice" },
    { topic: "Dynamic Programming", count: 22, successRate: 38, status: "Weak" },
    { topic: "Graph Algorithms", count: 15, successRate: 25, status: "Weak" },
    { topic: "Sorting & Searching", count: 10, successRate: 90, status: "Strong" },
  ];

  // Extract weaknesses
  const weaknesses = topicAnalysis.filter(t => t.successRate < 50).map(t => t.topic);

  // 4. Generate Strategic Improvement Roadmaps
  const roadmap = [
    { step: "Phase 1: Solidify Intermediate Math", Action: "Solve 20 problems tagged 'Number Theory' in the 1400-1500 difficulty bracket." },
    { step: "Phase 2: Conquer Knapsack & Linear DP", Action: "Review DP paradigms. Target CodeChef basic DP tracks; stop brute forcing optimization tasks." },
    { step: "Phase 3: Graph Traversal & Trees", Action: "Practice BFS/DFS implementations until execution time drops under 15 minutes per implementation." }
  ];

  // 5. Recent Submissions Feed
  const recentSolves = [
    { problemName: "Chef and Graph Queries", problemCode: "CHEFGPH", rating: 1650, time: "2 hours ago", status: "Accepted" },
    { problemName: "Max Range Queries", problemCode: "MAXRNG", rating: 1420, time: "1 day ago", status: "Accepted" },
    { problemName: "Subsegment Align", problemCode: "SUBALGN", rating: 1800, time: "3 days ago", status: "Wrong Answer" },
    { problemName: "Dynamic Grid Fill", problemCode: "DNYGRID", rating: 1510, time: "5 days ago", status: "Accepted" },
  ];

  // Calculate trends
  const performanceTrend = profile.currentRating >= profile.maxRating - 50 ? "Steady Growth" : "Recovering from Rating Drop";

  return NextResponse.json({
    profile,
    contestHistory,
    ratingDistribution,
    topicAnalysis,
    weaknesses,
    roadmap,
    recentSolves,
    improvementTrend: performanceTrend
  });
}
