import React, { createContext, PropsWithChildren, Reducer, useId, useReducer } from 'react';
import { PieceType } from '../components/Piece';
import { Stack } from 'stack-typescript';
import { tilePayload, TileType, tileTypes } from '../../data/tile_type';

export enum GameActionTypes {
    RESET_GAME,
    PLACE_PIECE,
    PLACE_MEEPLE,
    END_TURN,
    REMOVE_MEEPLE,
    ROTATE_CURRENT_PIECE,
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
    unplacedPieces: Stack<PieceType>,
    currentPiece: PieceType | null,
    meeples: MeepleType[],
    players: PlayerType[],
    currentPlayerId: string,
}

export type GameAction = {
    type: GameActionTypes.PLACE_PIECE,
    locationX: number,
    locationY: number,
} | {
    type: GameActionTypes.RESET_GAME
} | {
    type: GameActionTypes.ROTATE_CURRENT_PIECE,
    direction: 'left' | 'right'
} | {
    type: GameActionTypes.END_TURN
}

/*
*  all rotations must be done using this function!
*  rotation = angle in pi/2 radians from 1 to 3
*/
export const rotatePiece = (piece: PieceType, rotation: number): PieceType => {
    if(rotation < 1 || rotation > 3) throw new Error("Rotation must be between 1 and 3");
    return {
        ...piece,
        rotation: (piece.rotation + rotation) % 4,
        tile: {
            ...piece.tile,
            fields: piece.tile.fields.map(field => {
                return ({
                    sides: field.sides.map(f => {
                        f[0] = (f[0] + rotation - 1) % 4 + 1;
                        return f;
                    })
                    
                })
            }),
            roads: piece.tile.roads.map(road => {
                return {
                    sides: road.sides.map(num => {
                        return (num + rotation - 1) % 4 + 1;
                    })
                } 
            }),
            towns: piece.tile.towns.map(town => {
                return {
                    ...town,
                    sides: town.sides.map(num => {
                        return (num + rotation - 1) % 4 + 1;
                    })
                } 
            })

        }
    };
}

const gameReducer: Reducer<GameState, GameAction> = (state, action) => {
    switch (action.type) {
        case GameActionTypes.PLACE_PIECE:
            if(state.currentPiece === null) return state;
            if(state.placedPieces.find(p => p.positionX === action.locationX && p.positionY === action.locationY) !== undefined) return state;
            console.log("placing piece")
            return {
                ...state,
                currentPiece: null,
                placedPieces: [...state.placedPieces, {...state.currentPiece, positionX: action.locationX, positionY: action.locationY} as PieceType]
            }
        case GameActionTypes.ROTATE_CURRENT_PIECE:
            if(state.currentPiece === null) return state;
            return {
                ...state,
                currentPiece: rotatePiece(state.currentPiece, action.direction === 'left' ? 3 : 1)
            }
        case GameActionTypes.END_TURN:
            // todo: calculate finished roads, towns and fields and monestaries

            const stackDupe = new Stack<PieceType>(...state.unplacedPieces);
            const cPiece = stackDupe.pop();
            return {
                ...state,
                currentPiece: cPiece,
                unplacedPieces: stackDupe,
            }
        case GameActionTypes.RESET_GAME:
            const arr: PieceType[] = [];
            tilePayload.forEach(tile => {
                for(let i = 0; i < tile.value; i++) {
                    const t: PieceType = {
                        id: Math.random().toString(36).substring(20),
                        placed: false,
                        rotation: 0,
                        positionX: 0,
                        positionY: 0,
                        tile: tileTypes.find(t => t.type === tile.letter) as TileType
                    }
                    arr.push(t);
                }
            
            });
            arr.sort(() => Math.random() - 0.5);
            const stack = new Stack<PieceType>(...arr);
            const currentPiece = stack.pop();
            
            return {
                placedPieces: [],
                unplacedPieces: stack,
                currentPiece: currentPiece,
                meeples: [],
                players: [],
                currentPlayerId: ''
            };
        default:
            return state;
    }
}

const initialGameReducerState: GameState = {
    meeples: [],
    placedPieces: [],
    currentPiece: null,
    players: [],
    unplacedPieces: new Stack<PieceType>(),
    currentPlayerId: ''
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