import { Suspense } from 'react';
import { getMatchHistory } from '../util/db';
import Matches from './matches';

export const dynamic = 'force-dynamic'

export default async function GamesPage() {
  const matchesPromise = getMatchHistory();
  return (
    <div className='h-full overflow-y-auto'>
      <Suspense fallback={<div>Loading...</div>}>
        <Matches matchesPromise={matchesPromise} />
      </Suspense>
    </div>
  );
}