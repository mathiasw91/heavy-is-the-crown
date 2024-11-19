'use client'

import { use } from 'react';
import { GetStandingsRow } from '../util/db';
import Leader from './leader';
import Standing from './standing';

type StandingsProps = {
  standingsPromise: Promise<GetStandingsRow[]>;
}

export default function Standings({ standingsPromise }: StandingsProps) {
  const standings = use(standingsPromise);

  if (!standings?.length) return (
    <div>play your first match</div>
  );
  return (
    <div>
      {standings.map(standing => (
        (standing.rank === 1) && (
          <Leader key={standing.rank} standing={standing} />
        ) || (
          <Standing key={standing.rank} standing={standing} />
        )
      ))}
    </div>
  );
}