'use client'

import { Fragment, useEffect, useState } from 'react';
import { createMatch, getGamesAndPlayers } from './actions';
import { MatchState } from './types';
import { mapMatchStateToInput, validateMatchState } from './util';
import { createGame, GetGamesAndPlayersGameRow } from '@/app/util/db';
import AddGame from './addGame';

type CreateMatchModalProps = {
  onClose: () => void;
}

export default function CreateMatchModal({ onClose }: CreateMatchModalProps) {
  const [match, setMatch] = useState<MatchState>({
    date: new Date().toISOString().split('T')[0],
    game: undefined,
    players: [],
  });
  const [allGames, setAllGames] = useState<GetGamesAndPlayersGameRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [showNewGame, setShowNewGame] = useState(false);

  useEffect(() => {
    const fetchGamesAndPlayers = async () => {
      const { games, players} = await getGamesAndPlayers();
      setAllGames(games);
      setMatch(old => ({...old, players: players.map(player => ({...player, didPlay: true, didWin: false}))}));
    };
    fetchGamesAndPlayers();
  }, []);

  const setPlayerDidPlay = (id: number, value: boolean) => {
    setMatch(old => ({
      ...old,
      players: old.players.map(player => {
        if (player.id !== id) return player;
        return {...player, didPlay: value};
      })
    }));
  }

  const setPlayerDidWin = (id: number, value: boolean) => {
    setMatch(old => ({
      ...old,
      players: old.players.map(player => {
        if (player.id !== id) return player;
        return {...player, didWin: value};
      })
    }));
  }

  const onGameChange = (val: string) => {
    if (val === 'add-new') {
      setShowNewGame(true);
      return;
    }
    setMatch({...match, game: parseInt(val)});
  }

  const addGame = async (name: string) => {
    try {
      const id = await createGame({ name });
      setAllGames(old => [...old, {id, name}]);
      setMatch(old => ({...old, game: id}))
      setShowNewGame(false);
    } catch {
      setErrors(['Error adding a new game']);
    }
  }

  const submit = async () => {
    const errs = validateMatchState(match);
    if(errs.length) {
      setErrors(errs);
      return;
    }
    //TODO: loading indicator. not sure how to hide tho
    onClose();
    await createMatch(mapMatchStateToInput(match));
  };

  const rowClasses = 'py-2 flex flex-col';

  return (
    <div className='overlay-container grid grid-rows-[auto_1fr_auto]'>
      <h1 className='text-xl font-bold'>New Match</h1> 
      <div>
        {errors.map((err, index) => (
          <div key={index} className='text-error'>{err}</div>
        ))}
        <div className={rowClasses}>
          <label>Date</label>
          <input type="date" value={match.date} onChange={(event) => {setMatch({...match, date: event.target.value})}}></input>
        </div>
        <div className={rowClasses}>
          <label>Game</label>
          {showNewGame && (
            <AddGame onSubmit={(name) => addGame(name)}/>
          ) || (
            <select defaultValue='' value={match.game} onChange={(e) => onGameChange(e.target.value)}>
              <option value="" disabled>Select a game</option>
              <option value="add-new">Add new game</option>
              {allGames.map(({id, name}) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          )}
        </div>
        <div className={rowClasses}>
          <label>Players</label>
          <div className='grid grid-cols-[auto_auto_auto] gap-x-4 gap-y-2'>
            <div>Name</div>
            <div>Did play</div>
            <div>Did win</div>
            {match.players.map(({id, name, didPlay, didWin}) => (
              <Fragment key={id}>
                <div>{name}</div>
                <div>
                  <input type="checkbox" checked={didPlay} onChange={event => setPlayerDidPlay(id, event.target.checked)}></input>
                </div>
                <div>
                  <input type="checkbox" checked={didWin} onChange={event => setPlayerDidWin(id, event.target.checked)}></input>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className='flex justify-between'>
        <button onClick={onClose}>Cancel</button>
        <button onClick={submit}>Create new Match</button>
      </div>
    </div>
  );
}