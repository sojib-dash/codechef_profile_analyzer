import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // 1. Fetch Basic User Profile Data
    const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const userData = await userResponse.json();

    if (userData.status !== 'OK') {
      return NextResponse.json({ error: `Codeforces handle '${username}' not found` }, { status: 404 });
    }

    const profile = userData.result[0];
    const currentRating = profile.rating || 1500;
    const highestRating = profile.maxRating || 1500;
    const rank = profile.rank || 'unrated';
    const maxRank = profile.maxRank || 'unrated';
    const avatar = profile.titlePhoto || profile.avatar;

    // 2. Fetch User Contest History (To count total contests attended)
    const ratingResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
    const ratingData = await ratingResponse.json();

    let totalContests = 0;
    let contestHistory = [{ name: 'Start', rating: 1500 }];

    if (ratingData.status === 'OK') {
      totalContests = ratingData.result.length;
      if (totalContests > 0) {
        contestHistory = ratingData.result.map((c: any, index: number) => ({
          name: `Contest ${index + 1}`,
          rating: c.newRating
        }));
      }
    }

    // 3. Fetch User Submissions (To isolate problems solved DURING contest hours)
    const submissionResponse = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
    const submissionData = await submissionResponse.json();

    let problemsSolvedInContestTime = 0;
    const trackingSet = new Set(); // To avoid counting double submissions on the same problem

    if (submissionData.status === 'OK') {
      const submissions = submissionData.result;

      submissions.forEach((sub: any) => {
        // Condition: Must be correct solution, submitted as an official contestant, and inside contest runtime bounds
        const isAccepted = sub.verdict === 'OK';
        const isOfficialContestant = sub.author?.participantType === 'CONTESTANT';
        const uniqueProblemKey = `${sub.problem?.contestId}-${sub.problem?.index}`;

        if (isAccepted && isOfficialContestant && !trackingSet.has(uniqueProblemKey)) {
          problemsSolvedInContestTime++;
          trackingSet.add(uniqueProblemKey);
        }
      });
    }

    return NextResponse.json({
      username,
      currentRating,
      highestRating,
      rank,
      maxRank,
      avatar,
      totalContests,
      problemsSolvedInContestTime,
      contestHistory
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed calculating live Codeforces tournament data' }, { status: 500 });
  }
}
