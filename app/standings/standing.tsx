import { formatWinrate } from '../util/util';
import { Standing as StandingType } from './testdata';

type StandingProps = {
  standing: StandingType;
}

export default function Standing({standing: { player, rank, wins, winrate }}: StandingProps) {
  return (
    <div className="border-2 border-secondary rounded p-2 grid grid-cols-[1fr_40px_80px]">
      <div className="flex items-center gap-2">
        <div>{rank}.</div>
        <div className="text-xl font-semibold">{player}</div>
      </div>
      <div className='text-right'>{wins}</div>
      <div className='text-right'>{formatWinrate(winrate)}%</div>
    </div>
  );
}