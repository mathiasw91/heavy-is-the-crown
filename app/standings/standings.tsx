'use client'

import { use } from 'react';
import Leader from './leader';
import Standing from './standing';
import { GetStandingsResult } from '../util/db';

type StandingsProps = {
  standingsPromise: Promise<GetStandingsResult[]>;
}

export default function Standings({ standingsPromise }: StandingsProps) {
  const standings = use(standingsPromise);

  if (!standings?.length) return (
    <div>play your first match</div>
  );
  return (
    <div className='flex flex-col gap-2 overflow-hidden'>
      <div className='h-full overflow-y-auto'>
        {standings.map(standing => (
          (standing.rank === 1) && (
            <Leader key={standing.rank} standing={standing} />
          ) || (
            <Standing key={standing.rank} standing={standing} />
          )
        ))}
      </div>
    </div>
  );
}