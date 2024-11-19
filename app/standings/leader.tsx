import { GetStandingsRow } from '../util/db';
import { formatWinrate } from '../util/util';

type LeaderProps = {
  standing: GetStandingsRow;
}

export default function Leader({standing: { name, rank, matches_won, winrate }}: LeaderProps) {
  return (
    <div className="border-2 border-gold rounded p-4 text-lg flex-col flex gap-4 mb-4">
      <div className="flex items-end gap-2 text-gold">
        <div className='text-4xl font-semibold'>{rank}.</div>
        <div className="text-2xl font-semibold overflow-hidden text-ellipsis">{name}</div>
      </div>
      <div className="flex justify-between">
        <div>wins: {matches_won}</div>
        <div>winrate: {formatWinrate(winrate)}%</div>
      </div>
    </div>
  );
}