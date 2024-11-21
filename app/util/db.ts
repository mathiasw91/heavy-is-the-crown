'use server'

import { Pool } from "pg";
import { CreateMatchInput } from '../ui/editMatchModal/types';
import { formatDate } from './util';

const pool = new Pool({
  user: process.env.PGSQL_USER,
  password: process.env.PGSQL_PASSWORD,
  host: process.env.PGSQL_HOST,
  port: parseInt(process.env.PGSQL_PORT!),
  database: process.env.PGSQL_DATABASE,
});

type GetStandingsRow = {
  id: number;
  name: string;
  matches_played: string;
  matches_won: string;
  winrate: number;
  rank: number;
}
export type GetStandingsResult = Omit<GetStandingsRow, 'matches_played' | 'matches_won'> & { matches_played: number, matches_won: number};
export async function getStandings() {
  try {
    const query = `SELECT id, name, COUNT(player_id) as matches_played, COUNT(CASE is_winner when true then 1 else null end) as matches_won 
    FROM match_player LEFT JOIN player ON id = player_id GROUP BY id;`
    const result = await pool.query<GetStandingsRow>(query);
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

type GetSummaryRow = {
  amountplayed: string;
  lastplayed: Date;
}
export type GetSummaryResult = {
  amountplayed: number;
  lastplayed: string;
}
export async function getSummary() {
  try {
    const response = await pool.query<GetSummaryRow>(
      'SELECT COUNT(*) as amountPlayed, MAX(date) as lastPlayed FROM match;'
    );
    return {
      amountplayed: parseInt(response.rows[0].amountplayed),
      lastplayed: formatDate(response.rows[0].lastplayed),
    };
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function createMatch({ date, game, players }: CreateMatchInput): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const matchResult = await client.query<{id: number}>(
      `INSERT INTO match(date, game_id) VALUES($1, $2) RETURNING id;`,
      [date, game]
    );
    const matchId = matchResult.rows[0].id;
    if (matchId === undefined) throw new Error();
    await client.query(
      `INSERT INTO match_player(match_id, player_id, is_winner) VALUES
      ${players.map((player, index, arr) => 
        `(${matchId},${player.id},${player.winner})${index === arr.length-1 ? ';' : ''}`
      )}`
    );
    await client.query('COMMIT');
    return matchId;
  } catch ( error ) {
    await client.query('ROLLBACK');
    console.log(error);
    throw new Error();
  }
}

export type GetGamesAndPlayersGameRow = {id: number, name: string};
export type GetGamesAndPlayersPlayerRow = {id: number, name: string};
export async function getGamesAndPlayers() {
  try {
    const { rows: games} = await pool.query<GetGamesAndPlayersGameRow>('SELECT id, name FROM game;');
    const { rows: players } = await pool.query<GetGamesAndPlayersPlayerRow>('SELECT id, name FROM player;');
    return {
      games: games.sort((a, b) => a.name.localeCompare(b.name)),
      players: players.sort((a, b) => a.name.localeCompare(b.name)),
    };
  } catch ( error ) {
    console.log(error);
    throw new Error();
  }

}