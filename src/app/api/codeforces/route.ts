import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Fetch user info directly from the official Codeforces API
    const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const userData = await userResponse.json();

    if (userData.status !== 'OK') {
      return NextResponse.json({ error: `Codeforces handle '${username}' not found` }, { status: 404 });
    }

    const profile = userData.result[0];

    // Extract real Codeforces API parameters
    const currentRating = profile.rating || 1500;
    const highestRating = profile.maxRating || 1500;
    const rank = profile.rank || 'unrated';
    const maxRank = profile.maxRank || 'unrated';
    const avatar = profile.titlePhoto || profile.avatar;

    // Fetch the user's real contest history from Codeforces API to populate the chart dynamically
    const ratingResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
    const ratingData = await ratingResponse.json();

    let contestHistory = [{ name: 'Start', rating: 1500 }];
    if (ratingData.status === 'OK' && ratingData.result.length > 0) {
      contestHistory = ratingData.result.map((c: any, index: number) => ({
        name: `Contest ${index + 1}`,
        rating: c.newRating
      }));
    } else {
      // Fallback timeline if the user has no contests yet
      contestHistory = [
        { name: 'Start', rating: 1500 },
        { name: 'Current', rating: currentRating }
      ];
    }

    return NextResponse.json({
      username,
      currentRating,
      highestRating,
      rank,
      maxRank,
      avatar,
      contestHistory
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed communicating with Codeforces API' }, { status: 500 });
  }
}
