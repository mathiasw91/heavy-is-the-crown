import { GetGamesAndPlayersPlayerRow } from '@/app/util/db';

export type CreateMatchInput = {
  date: string;
  game: string;
  players: {
    id: number;
    winner: boolean;
  }[];
};

export type MatchState = Omit<CreateMatchInput, 'game' | 'players'> & {
  game?: string;
  players: Player[];
};

export type Player = GetGamesAndPlayersPlayerRow & {
  didPlay: boolean;
  didWin: boolean;
};