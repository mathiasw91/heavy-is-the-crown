import { Suspense } from 'react';
import { getStandings, getSummary } from '../util/db';
import Standings from './standings';
import { Summary } from './summary';

export const dynamic = 'force-dynamic'

export default async function StandingsPage() {
  const standingsPromise = getStandings();
  const summaryPromise = getSummary();
  return (
    <div className='grid grid-rows-[1fr_auto] h-full overflow-hidden'>
      <Suspense fallback={<div>Loading...</div>}>
        <Standings standingsPromise={standingsPromise} />
      </Suspense>
      <Suspense>
        <Summary summaryPromise={summaryPromise} /> 
      </Suspense>
    </div>
  );
}