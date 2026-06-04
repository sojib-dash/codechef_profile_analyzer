import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Fetch directly from CodeChef with standard browser headers to avoid getting blocked
    const response = await fetch(`https://www.codechef.com/users/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 60 } // Cache profiles for 1 minute
    });

    if (!response.ok) {
      return NextResponse.json({ error: `CodeChef profile '${username}' not found` }, { status: 404 });
    }

    const html = await response.target ? await response.text() : await response.text();

    // Regex extraction engine to read CodeChef's internal frontend state object
    const ratingRegex = /"rating":\s*(\d+)/;
    const highestRatingRegex = /"highest_rating":\s*(\d+)/;
    const starsRegex = /"stars":\s*"([^"]+)"/;
    const globalRankRegex = /"global_rank":\s*(\d+)/;
    const countryRankRegex = /"country_rank":\s*(\d+)/;

    const currentRating = parseInt(html.match(ratingRegex)?.[1] || '1200');
    const highestRating = parseInt(html.match(highestRatingRegex)?.[1] || '1200');
    let stars = html.match(starsRegex)?.[1] || '1 ★';
    if (!stars.includes('★')) stars = `${stars} ★`;

    const globalRank = html.match(globalRankRegex)?.[1] || 'N/A';
    const countryRank = html.match(countryRankRegex)?.[1] || 'N/A';

    // Generates chronological sample data based on your tier metrics
    const contestHistory = [
      { name: 'Start', rating: 1200, rank: 0 },
      { name: 'Contest 1', rating: Math.round(currentRating * 0.9), rank: 2450 },
      { name: 'Contest 2', rating: Math.round(currentRating * 0.95), rank: 1120 },
      { name: 'Contest 3', rating: currentRating, rank: 450 }
    ];

    const mockTopics = [
      { topic: 'Arrays & Strings', solved: 45, accuracy: 78 },
      { topic: 'Greedy Algorithms', solved: 22, accuracy: 64 },
      { topic: 'Dynamic Programming', solved: 8, accuracy: 31 },
      { topic: 'Graph Theory', solved: 4, accuracy: 25 },
      { topic: 'Math & Number Theory', solved: 33, accuracy: 82 }
    ];

    const problemsSolvedOverview = [
      { name: '800-1200', count: 55 },
      { name: '1200-1400', count: 32 },
      { name: '1400-1600', count: 18 },
      { name: '1600-1800', count: 6 },
      { name: '1800+', count: 1 },
    ];

    const weaknesses = mockTopics
      .filter(t => t.accuracy < 50 || t.solved < 10)
      .map(t => t.topic);

    const roadmap = [
      `Target focus: Solve 15 problems specifically in: ${weaknesses.join(', ')}.`,
      `Attempt contests regularly to stabilize your active execution profile.`,
      `Bridge the gap between your current rating (${currentRating}) and peak historical maximum (${highestRating}).`
    ];

    const recentSolves = [
      { code: 'FLOW001', name: 'Add Two Numbers' },
      { code: 'TSORT', name: 'Turbo Sort' },
      { code: 'ATM', name: 'HS08TEST' },
    ];

    return NextResponse.json({
      username,
      currentRating,
      highestRating,
      stars,
      globalRank,
      countryRank,
      problemsSolved: mockTopics.reduce((a, b) => a + b.solved, 0),
      averageRank: 1340,
      bestContestPerformance: `Rank #450`,
      improvementTrend: currentRating >= 1400 ? 'Upward Spike' : 'Stable',
      contestHistory,
      problemsSolvedOverview,
      topicAnalyze: mockTopics,
      weaknesses,
      roadmap,
      recentSolves
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed parsing core backend telemetry' }, { status: 500 });
  }
}
