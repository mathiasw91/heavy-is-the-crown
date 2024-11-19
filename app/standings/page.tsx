import { Suspense } from 'react';
import { getStandings } from '../util/db';
import Standings from './standings';

export default async function StandingsPage() {
  const standingsPromise = getStandings();
  return (
    <div className='flex flex-col gap-2'>
      <Suspense fallback={<div>Loading...</div>}>
        <Standings standingsPromise={standingsPromise} />
      </Suspense>
    </div>
  );
}