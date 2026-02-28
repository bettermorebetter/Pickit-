/* ══════════════════════════════════════════════════════════════
   App state context — useReducer-based global state
══════════════════════════════════════════════════════════════ */

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppState, AppAction, Restaurant, BracketState } from '../types/index.ts';
import { TOTAL_MATCHES } from '../types/index.ts';
import { shuffle } from '../data/constants.ts';

const initialBracket: BracketState = {
  rounds: [],
  currentRound: 0,
  currentMatch: 0,
  winners: [[]],
};

const initialState: AppState = {
  screen: 'location',
  locationMode: null,
  pinLat: null,
  pinLng: null,
  restaurants: [],
  bracket: initialBracket,
  champion: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'SET_LOCATION_MODE':
      return { ...state, locationMode: action.mode };

    case 'SET_PIN':
      return { ...state, pinLat: action.lat, pinLng: action.lng };

    case 'CLEAR_PIN':
      return { ...state, pinLat: null, pinLng: null };

    case 'SET_RESTAURANTS':
      return { ...state, restaurants: action.restaurants };

    case 'INIT_BRACKET': {
      const shuffled = shuffle(action.restaurants);
      const bracket: BracketState = {
        rounds: [
          [
            [shuffled[0], shuffled[1]],
            [shuffled[2], shuffled[3]],
            [shuffled[4], shuffled[5]],
            [shuffled[6], shuffled[7]],
          ],
        ],
        currentRound: 0,
        currentMatch: 0,
        winners: [[]],
      };
      return { ...state, bracket };
    }

    case 'PICK_WINNER': {
      const { bracket } = state;
      const newWinners = bracket.winners.map(arr => [...arr]);
      newWinners[bracket.currentRound] = [
        ...newWinners[bracket.currentRound],
        action.winner,
      ];

      const totalMatchesInRound = TOTAL_MATCHES[bracket.currentRound];
      let newCurrentMatch = bracket.currentMatch;
      let newCurrentRound = bracket.currentRound;
      let newRounds = [...bracket.rounds];
      let champion: Restaurant | null = null;

      if (bracket.currentMatch + 1 < totalMatchesInRound) {
        newCurrentMatch = bracket.currentMatch + 1;
      } else {
        const roundWinners = newWinners[bracket.currentRound];

        if (bracket.currentRound === 2) {
          // Final match done
          champion = roundWinners[0];
        } else {
          // Advance to next round
          const nextRoundPairs: [Restaurant, Restaurant][] = [];
          for (let i = 0; i < roundWinners.length; i += 2) {
            nextRoundPairs.push([roundWinners[i], roundWinners[i + 1]]);
          }
          newRounds = [...newRounds, nextRoundPairs];
          newCurrentRound = bracket.currentRound + 1;
          newCurrentMatch = 0;
          newWinners.push([]);
        }
      }

      return {
        ...state,
        bracket: {
          rounds: newRounds,
          currentRound: newCurrentRound,
          currentMatch: newCurrentMatch,
          winners: newWinners,
        },
        champion: champion ?? state.champion,
        screen: champion ? 'result' : state.screen,
      };
    }

    case 'SET_CHAMPION':
      return { ...state, champion: action.champion, screen: 'result' };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
