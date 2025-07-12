
type MatchProps = {
  game: string;
  date: string;
  winner: string[];
  players: string[];
};
export default function Match({ game, date, winner, players }: MatchProps) {
  return (
    <div  className="border-2 border-secondary rounded p-2 gap-4 grid grid-rows-[auto_auto] relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>{date}</div>
        <div>{players.length} players</div>
      </div>
      <div className='flex items-center justify-between'>
        <div className="font-bold">{winner.join(', ')}</div>
        <div className="text-right">{game}</div>
      </div>
      <span className='absolute opacity-35 -bottom-1.5 -left-6 text-6xl -z-10'>👑</span> 
    </div>
  );
}