import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  host: process.env.PGSQL_HOST,
  port: parseInt(process.env.PGSQL_PORT!),
  database: process.env.PGSQL_DATABASE,
});

export type GetStandingsRow = {
  id: number;
  name: string;
  matches_played: number;
  matches_won: number;
  winrate: number;
  rank: number;
}
export async function getStandings(): Promise<GetStandingsRow[]> {
  try {
    const query = `SELECT id, name, COUNT(player_id) as matches_played, COUNT(CASE is_winner when true then 1 else null end) as matches_won 
    FROM match_player LEFT JOIN player ON id = player_id GROUP BY id;`
    const result = await pool.query(
      query,
    );
    return result.rows
      .map(row => ({
        ...row,
        matches_played: parseInt(row.matches_played),
        matches_won: parseInt(row.matches_won),
      }))
      .sort((a, b) => a.matches_played - b.matches_played)
      .map((row, index) => ({
        ...row,
        winrate: row.matches_won ? row.matches_played / row.matches_won : 0,
        rank: index + 1,
      }));
  } catch ( error ) {
    console.log( error );
    throw new Error();
  }
  };