import React, { createContext, PropsWithChildren, Reducer, useReducer } from 'react';
import { PieceType } from '../components/Piece';
import { Stack } from 'stack-typescript';

export enum GameActionTypes {
    RESET_GAME,
    ADD_PIECE,
    PLACE_MEEPLE,
    REMOVE_MEEPLE,
}

export type PlayerType = {
    id: string,
    name: string,
    score: number,
    numberOfMeeples: number,
}

export type MeepleType = {
    id: string,
    playerId: string,
    positionX: number,
    positionY: number,
    state: any
}

export type GameState = {
    placedPieces: PieceType[],
    unplacedPieces: Stack<PieceType>
    meeples: MeepleType[],
    players: PlayerType[],
}

export type GameAction = {
    type: GameActionTypes.ADD_PIECE,
    piece: PieceType
} //todo rest


const gameReducer: Reducer<GameState, GameAction> = (state, action) => {
    switch (action.type) {
        case GameActionTypes.ADD_PIECE:
            return {
                ...state,
                placedPieces: [...state.placedPieces, action.piece]
            }

        default:
            return state;
    }
}

const initialGameReducerState: GameState = {
    meeples: [],
    placedPieces: [],
    players: [],
    unplacedPieces: new Stack<PieceType>()
}

export type GameContextType = {
    state: GameState
    dispatch: React.Dispatch<GameAction>
}

export const GameContext = createContext<GameContextType>({state: initialGameReducerState, dispatch: () => {}});



const GameProvider: React.FC<PropsWithChildren> = ({children}) => {

    const [state, dispatch] = useReducer(gameReducer, initialGameReducerState);

    return (
        <GameContext.Provider value={{state: state, dispatch: dispatch}}>
            {children}
        </GameContext.Provider>
    )
}

export default GameProvider;