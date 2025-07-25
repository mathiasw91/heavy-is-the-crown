import { GetStandingsResult } from '../util/db';
import { formatWinrate } from '../util/util';

type LeaderProps = {
  standing: GetStandingsResult;
}

export default function Leader({standing: { name, rank, matches_won, winrate }}: LeaderProps) {
  return (
    <div className="border-2 border-gold rounded p-4 text-lg flex-col flex gap-4 mb-4 relative overflow-hidden">
      <div className="flex items-end gap-2 text-gold">
        <div className='text-4xl font-semibold'>{rank}.</div>
        <div className="text-2xl font-semibold overflow-hidden text-ellipsis">{name}</div>
      </div>
      <div className="flex justify-between">
        <div>wins: {matches_won}</div>
        <div>winrate: {formatWinrate(winrate)}%</div>
      </div>
      <div className='absolute -right-8 -top-1 text-9xl opacity-35 -z-10'>👑</div>
    </div>
  );
}