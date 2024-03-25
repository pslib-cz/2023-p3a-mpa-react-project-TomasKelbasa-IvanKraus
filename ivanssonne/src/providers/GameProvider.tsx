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
    possiblePiecePlacements: number[][]
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
const rotatePiece = (piece: PieceType, rotation: number): PieceType => {
    if(rotation < 1 || rotation > 3) throw new Error("Rotation must be between 1 and 3");
    return {
        ...piece,
        rotation: (piece.rotation + rotation) % 4,
        tile: {
            ...piece.tile,
            fields: piece.tile.fields.map(field => {
                return ({
                    sides: field.sides.map(f => {
                        let t = [...f];
                        t[0] = (t[0] + rotation - 1) % 4 + 1;
                        return t;
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

const calculatePossiblePlacements = (state: GameState, cPiece: PieceType): number[][] => {

        const possiblePlacements: number[][] = [];
        const impossiblePlacements: number[][] = [];

        state.placedPieces.forEach(piece => {
            for(let i = 1; i <= 4; i++){
                let statement: boolean = false;
                switch(i){
                    case 1:
                        if(impossiblePlacements.find(ip => ip[0] === piece.positionX && ip[1] === piece.positionY + 1) !== undefined) continue;
                        statement = state.placedPieces.find(p => p.positionX === piece.positionX && p.positionY === piece.positionY + 1) !== undefined;
                        if(statement){
                            impossiblePlacements.push([piece.positionX, piece.positionY + 1]);
                            continue;
                        }
                        if(arePiecesCompatible(piece, cPiece, i)){
                            possiblePlacements.push([piece.positionX, piece.positionY + 1]);
                        }else{
                            impossiblePlacements.push([piece.positionX, piece.positionY + 1]);
                        }
                        break;
                    case 2:
                        if(impossiblePlacements.find(ip => ip[0] === piece.positionX - 1 && ip[1] === piece.positionY) !== undefined) continue;
                        statement = state.placedPieces.find(p => p.positionX === piece.positionX - 1 && p.positionY === piece.positionY) !== undefined;
                        if(statement){
                            impossiblePlacements.push([piece.positionX - 1, piece.positionY]);
                            continue;
                        }
                        if(arePiecesCompatible(piece, cPiece, i)){
                            possiblePlacements.push([piece.positionX - 1, piece.positionY]);
                        }
                        else{
                            impossiblePlacements.push([piece.positionX - 1, piece.positionY]);
                        }
                        break;
                    case 3:
                        if(impossiblePlacements.find(ip => ip[0] === piece.positionX && ip[1] === piece.positionY - 1) !== undefined) continue;
                        statement = state.placedPieces.find(p => p.positionX === piece.positionX && p.positionY === piece.positionY - 1) !== undefined;
                        if(statement){
                            impossiblePlacements.push([piece.positionX, piece.positionY - 1]);
                            continue;
                        }
                        if(arePiecesCompatible(piece, cPiece, i)){
                            possiblePlacements.push([piece.positionX, piece.positionY - 1]);
                        }
                        else{
                            impossiblePlacements.push([piece.positionX, piece.positionY - 1]);
                        }
                        break;
                    case 4:
                        if(impossiblePlacements.find(ip => ip[0] === piece.positionX + 1 && ip[1] === piece.positionY) !== undefined) continue;
                        statement = state.placedPieces.find(p => p.positionX === piece.positionX + 1 && p.positionY === piece.positionY) !== undefined;
                        if(statement){
                            impossiblePlacements.push([piece.positionX + 1, piece.positionY]);
                            continue;
                        }
                        if(arePiecesCompatible(piece, cPiece, i)){
                            possiblePlacements.push([piece.positionX + 1, piece.positionY]);
                        }
                        else{
                            impossiblePlacements.push([piece.positionX + 1, piece.positionY]);
                        }
                        break;
                }
            }
                
        });

        return possiblePlacements.filter(p => impossiblePlacements.find(ip => ip[0] === p[0] && ip[1] === p[1]) === undefined);
}

const gameReducer: Reducer<GameState, GameAction> = (state, action) => {
    switch (action.type) {
        case GameActionTypes.PLACE_PIECE:
            if(state.currentPiece === null) return state;
            if(state.possiblePiecePlacements.find(p => p[0] === action.locationX && p[1] === action.locationY) === undefined) return state;
            console.log("placing piece")
            return {
                ...state,
                currentPiece: null,
                possiblePiecePlacements: [],
                placedPieces: [...state.placedPieces, {...state.currentPiece, positionX: action.locationX, positionY: action.locationY, placed: true} as PieceType]
            }
        case GameActionTypes.ROTATE_CURRENT_PIECE:
            if(state.currentPiece === null) return state;
            const rotatedPiece = rotatePiece(state.currentPiece, action.direction === 'left' ? 3 : 1);
            console.log(rotatedPiece);
            return {
                ...state,
                currentPiece: rotatedPiece,
                possiblePiecePlacements: calculatePossiblePlacements(state, rotatedPiece)
            }
        case GameActionTypes.END_TURN:
            // todo: calculate finished roads, towns and fields and monestaries

            const stackDupe = new Stack<PieceType>(...state.unplacedPieces);
            const cPiece = stackDupe.pop();
            const possiblePlacements = calculatePossiblePlacements(state, cPiece);

            return {
                ...state,
                currentPiece: cPiece,
                unplacedPieces: stackDupe,
                possiblePiecePlacements: possiblePlacements
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
                ...initialGameReducerState,
                unplacedPieces: stack,
                currentPiece: currentPiece,
                possiblePiecePlacements: [[10, 10]]
            };
        default:
            return state;
    }
}

const initialGameReducerState: GameState = {
    meeples: [],
    placedPieces: [],
    currentPiece: null,
    possiblePiecePlacements: [],
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

/// piece1touchingSide is the side of piece1 that is touching piece2 (1 = bottom, 2 = left, 3 = top, 4 = right)
const arePiecesCompatible = (piece1: PieceType, piece2: PieceType, piece1touchingSide: number): boolean => {

    let piece2touchingSide: number;
    switch(piece1touchingSide){
        case 1:
            piece2touchingSide = 3;
            break;
        case 2:
            piece2touchingSide = 4;
            break;
        case 3:
            piece2touchingSide = 1;
            break;
        case 4:
            piece2touchingSide = 2;
            break;
        default:
            throw new Error("Invalid side");
    }
    console.log(piece1touchingSide, piece2touchingSide);

    const piece1town = piece1.tile.towns.find(town => town.sides.find(a => a === piece1touchingSide) !== undefined) !== undefined;
    const piece2town = piece2.tile.towns.find(town => town.sides.find(a => a === piece2touchingSide) !== undefined) !== undefined;
    if(piece1town !== piece2town) return false;

    const piece1road = piece1.tile.roads.find(road => road.sides.find(a => a === piece1touchingSide) !== undefined) !== undefined;
    const piece2road = piece2.tile.roads.find(road => road.sides.find(a => a === piece2touchingSide) !== undefined) !== undefined;
    if(piece1road !== piece2road) return false;

    const piece1fields = piece1.tile.fields.filter(field => field.sides.find(a => a[0] === piece1touchingSide) !== undefined).map(field => field.sides.find(a => a[0] === piece1touchingSide) as [number, number]);
    const piece2fields = piece2.tile.fields.filter(field => field.sides.find(a => a[0] === piece2touchingSide) !== undefined).map(field => field.sides.find(a => a[0] === piece2touchingSide) as [number, number]);

    if(piece1fields.length !== piece2fields.length) return false;

    piece1fields.forEach(field1 => {
        if(piece2fields.find(field2 => field2 === field1) === undefined) return false;
    });

    return true;


    
}

