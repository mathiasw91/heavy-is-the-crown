import { GetGamesAndPlayersPlayerRow } from '@/app/util/db';

export type CreateMatchInput = {
  date: string;
  game: number;
  players: {
    id: number;
    winner: boolean;
  }[];
};

export type MatchState = Omit<CreateMatchInput, 'game' | 'players'> & {
  game?: number;
  players: Player[];
};

export type Player = GetGamesAndPlayersPlayerRow & {
  didPlay: boolean;
  didWin: boolean;
};