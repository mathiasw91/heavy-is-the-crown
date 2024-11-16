import { formatWinrate } from '../util/util';
import { Standing } from './testdata';

type LeaderProps = {
  standing: Standing;
}

export default function Leader({standing: { player, rank, wins, winrate }}: LeaderProps) {
  return (
    <div className="border-2 border-gold rounded p-4 text-lg flex-col flex gap-4 mb-4">
      <div className="flex items-end gap-2 text-gold">
        <div className='text-4xl font-semibold'>{rank}.</div>
        <div className="text-2xl font-semibold overflow-hidden text-ellipsis">{player}</div>
      </div>
      <div className="flex justify-between">
        <div>wins: {wins}</div>
        <div>winrate: {formatWinrate(winrate)}%</div>
      </div>
    </div>
  );
}