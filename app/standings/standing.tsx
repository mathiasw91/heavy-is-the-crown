import { GetStandingsRow } from '../util/db';
import { formatWinrate } from '../util/util';

type StandingProps = {
  standing: GetStandingsRow;
}

export default function Standing({standing: { name, rank, matches_won, winrate }}: StandingProps) {
  return (
    <div className="border-2 border-secondary rounded p-2 grid grid-cols-[1fr_40px_80px]">
      <div className="flex items-center gap-2">
        <div>{rank}.</div>
        <div className="text-xl font-semibold">{name}</div>
      </div>
      <div className='text-right'>{matches_won}</div>
      <div className='text-right'>{formatWinrate(winrate)}%</div>
    </div>
  );
}