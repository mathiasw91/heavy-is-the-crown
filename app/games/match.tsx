
type MatchProps = {
  game: string;
  date: string;
  winner: string[];
  players: string[];
};
export default function Match({ game, date, winner, players }: MatchProps) {
  return (
    <div  className="border-2 border-secondary rounded p-2 grid grid-rows-[auto_1fr_auto]">
      <div className="flex items-center justify-between">
        <div>{date}</div>
        <div>{players.length} players</div>
      </div>
      <div className="text-gold">👑 {winner.join(', ')}</div>
      <div className="text-right font-bold">{game}</div>
    </div>
  );
}