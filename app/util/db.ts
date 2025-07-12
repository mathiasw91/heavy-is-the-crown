'use server'

import { Pool } from "pg";
import { CreateMatchInput } from '../ui/editMatchModal/types';
import { formatDate } from './util';

let pool: Pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  pool = new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: parseInt(process.env.PGSQL_PORT!),
    database: process.env.PGSQL_DATABASE,
  });
}

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
      .sort((a, b) => b.matches_won - a.matches_won)
      .map((row, index) => ({
        ...row,
        winrate: row.matches_played ? row.matches_won / row.matches_played : 0,
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
      amountplayed: response.rows[0]?.amountplayed && parseInt(response.rows[0].amountplayed) || 0,
      lastplayed: response.rows[0]?.lastplayed && formatDate(response.rows[0].lastplayed) || 'never',
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
export type CreateGameInput = { name: string };
export async function createGame({ name }: CreateGameInput): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query<{id: number}>(
      `INSERT INTO game(name) VALUES($1) RETURNING id;`,
      [name]
    );
    const id = result.rows[0].id;
    if (id === undefined) throw new Error();
    return id;
  } catch ( error ) {
    console.log(error);
    throw new Error();
  }
}

type GetMatchHistoryRow = {
  match_id: number;
  match_date: Date;
  game_name: string;
  player_names: string;
  winner_names: string;
}
export type GetMatchHistoryResult = Omit<GetMatchHistoryRow, 'match_date' | 'player_names' | 'winner_names'> & { match_date: string, player_names: string[], winner_names: string[]};
export async function getMatchHistory() {
  try {
    const { rows } = await pool.query<GetMatchHistoryRow>(`SELECT
          m.id AS match_id,
          m.date AS match_date,
          g.name AS game_name,
          STRING_AGG(p.name, ', ' ORDER BY p.name) AS player_names,
          (
              SELECT STRING_AGG(p2.name, ', ' ORDER BY p2.name)
              FROM match_player mp2
              JOIN player p2 ON p2.id = mp2.player_id
              WHERE mp2.match_id = m.id AND mp2.is_winner = true
          ) AS winner_names
      FROM match m
      JOIN game g ON m.game_id = g.id
      JOIN match_player mp ON mp.match_id = m.id
      JOIN player p ON p.id = mp.player_id
      GROUP BY m.id, m.date, g.name
      ORDER BY m.date DESC, m.id;`);
    return rows?.map(row => ({
      ...row,
      player_names: row.player_names.split(',').map(name => name.trim()),
      winner_names: row.winner_names.split(',').map(name => name.trim()),
      match_date: formatDate(row.match_date),
    })) || [];
  } catch ( error ) {
    console.log(error);
    throw new Error();
  }
}
