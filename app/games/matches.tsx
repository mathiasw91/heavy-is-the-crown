'use client'

import { use } from 'react';
import { GetMatchHistoryResult } from '../util/db';
import Match from './match';

type MatchesProps = {
  matchesPromise: Promise<GetMatchHistoryResult[]>;
}

export default function Matches({ matchesPromise }: MatchesProps) {
  const matches = use(matchesPromise);

  if (!matches?.length) return (
    <div>play your first match</div>
  );
  return (
    <div className='flex flex-col gap-2 overlow-y-auto'>
      {matches.map((match, index) => (
        <Match key={index} date={match.match_date} game={match.game_name} players={match.player_names} winner={match.winner_names} />
      ))}
    </div>
  );
}