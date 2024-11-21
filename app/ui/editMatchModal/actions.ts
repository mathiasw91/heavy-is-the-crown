import { createMatch as dbCreateMatch, getGamesAndPlayers as dbGetGamesAndPlayers } from '@/app/util/db';
import { CreateMatchInput } from './types';
import { redirect } from 'next/navigation';

export async function createMatch(input: CreateMatchInput) {
  await dbCreateMatch(input);
  redirect('/standings');
}

export async function getGamesAndPlayers() {
  return await dbGetGamesAndPlayers();
}