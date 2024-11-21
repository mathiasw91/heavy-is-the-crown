import { CreateMatchInput, MatchState } from './types';

export function validateMatchState(match: MatchState): string[] {
  const errors = [];
  if (match.game === undefined || !match.game.length) {
    errors.push('A game needs to be selected.');
  }
  if (match.players.filter(player => player.didPlay).length < 2) {
    errors.push("At least two players need to be selected.");
  }
  if (!match.players.filter(player => player.didWin).length) {
    errors.push("At last one winner needs to be selected.");
  }
  return errors;
}

export function mapMatchStateToInput(state: MatchState): CreateMatchInput {
  return {
    ...state,
    game: state.game!, //validation assured this
    players: state.players
      .filter(player => player.didPlay)
      .map(({ id, didWin }) => ({ id, winner: didWin }))
  };
}