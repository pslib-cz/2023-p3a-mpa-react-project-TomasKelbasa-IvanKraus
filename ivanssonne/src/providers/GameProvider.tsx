import React, { createContext, PropsWithChildren, Reducer, useContext, useId, useReducer } from 'react';
import { PieceType } from '../components/Piece';
import { Stack } from 'stack-typescript';
import { RoadType, tilePayload, TileType, tileTypes, TownType } from '../../data/tile_type';
import { v4 as uuidv4 } from 'uuid';
import { SettingsContext, TypeOfGame, MeepleColors } from './SettingsProvider';


const firstPiecePosition = [10, 10];

export enum GameActionTypes {
    RESET_GAME,
    PLACE_PIECE,
    PLACE_MEEPLE,
    END_TURN,
    GET_NEW_PIECE,
    ROTATE_CURRENT_PIECE,
    CHANGE_SETTINGS
}

export type PlayerType = {
    id: string,
    name: string,
    meepleColor: MeepleColors
    score: number,
    numberOfMeeples: number,
}

export type MeepleType = {
    id: string,
    playerId: string,
    positionX: number,
    positionY: number,
    positionInPiece: number[],
    state: any
}

export type GameState = {
    placedPieces: PieceType[],
    unplacedPieces: Stack<PieceType>,
    currentPiece: PieceType | null,
    currentPieceImpossibleToPlace: boolean,
    currentlyPlacedPieceId: string | null,
    meeples: MeepleType[],
    players: PlayerType[],
    currentPlayerId: string,
    possiblePiecePlacements: number[][],
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
} | {
    type: GameActionTypes.PLACE_MEEPLE,
    position: number[]
} | {
    type: GameActionTypes.GET_NEW_PIECE,
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

        if(state.placedPieces.length <= 0) return [[...firstPiecePosition]];

        const possiblePlacements: number[][] = [];
        const impossiblePlacements: number[][] = [];

        state.placedPieces.forEach(piece => {
            let pos: number[] = [];
            for(let i = 1; i <= 4; i++){
                
                switch(i){
                    case 1:
                        pos = [piece.positionX, piece.positionY + 1];
                        break;
                    case 2:
                        pos = [piece.positionX - 1, piece.positionY];
                        break;
                    case 3:
                        pos = [piece.positionX, piece.positionY - 1];
                        break;
                    case 4:
                        pos = [piece.positionX + 1, piece.positionY];
                        break;
                        
                }
                
                if(impossiblePlacements.find(ip => ip[0] === pos[0] && ip[1] === pos[1]) !== undefined) continue;
                const statement = state.placedPieces.find(p => p.positionX === pos[0] && p.positionY === pos[1]) !== undefined;
                if(statement){
                    impossiblePlacements.push([...pos]);
                    continue;
                }
                if(arePiecesCompatible(piece, cPiece, i)){
                    possiblePlacements.push([...pos]);
                }
                else{
                    impossiblePlacements.push([...pos]);
                }
            }
                
        });

        return possiblePlacements.filter(p => impossiblePlacements.find(ip => ip[0] === p[0] && ip[1] === p[1]) === undefined);
}

function onlyUnique(value:any, index:number, array:any[]) {
    if(value === null || value === undefined) return false;
    return array.indexOf(value) === index;
}

const gameReducer: Reducer<GameState, GameAction> = (state, action) => {
    switch (action.type) {
        case GameActionTypes.PLACE_PIECE:
            if(state.currentPiece === null) return state;
            if(state.possiblePiecePlacements.find(p => p[0] === action.locationX && p[1] === action.locationY) === undefined) return state;
            console.log("placing piece")


            return {
                ...state,
                currentlyPlacedPieceId: state.currentPiece.id,
                currentPiece: null,
                possiblePiecePlacements: [],
                placedPieces: [...state.placedPieces, {...state.currentPiece, positionX: action.locationX, positionY: action.locationY, placed: true} as PieceType]
            }
        case GameActionTypes.PLACE_MEEPLE:
            console.log("test")
            let cPlayer  = state.players.find(p => p.id === state.currentPlayerId);
            console.log(state.currentPlayerId)
            console.log(cPlayer)
            if(!cPlayer) return state;
            if(cPlayer.numberOfMeeples <= 0) return state;

            const cpp = state.placedPieces.find(p => p.id === state.currentlyPlacedPieceId);

            const meeple: MeepleType = {
                id: uuidv4(),
                playerId: cPlayer.id,
                positionX: cpp?.positionX as number,
                positionY: cpp?.positionY as number,
                positionInPiece: action.position,
                state: null
            }
            console.log("placing meeple");
            return {
                ...state,
                meeples: [...state.meeples, meeple],
                players: [...state.players.map(p => {
                    if(p.id === cPlayer?.id){
                        return {...cPlayer, numberOfMeeples: cPlayer.numberOfMeeples - 1};    
                    }else{
                        return p;
                    }
                })]
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
            // todo: calculate finished roads, towns and monestaries
            const currentlyPlacedPiece = state.placedPieces.find(p => p.id === state.currentlyPlacedPieceId);
            const meepleIdsToRemove: string[] = [];
            let modifiedPlayers = [...state.players];

            if(!currentlyPlacedPiece) console.error("Ivan je ivan")
            else{

                // monestaries
                const monasteries = state.meeples.filter(m => m.positionInPiece[0] === 5);
                for(let q = 0; q < monasteries.length; q++){
                    let monastery = monasteries[q];
                    let closed = true;
                    for(let m = -1; m <= 1; m++){
                        for(let n = -1; n <= 1; n++){
                            if(state.placedPieces.find(p => p.positionX === monastery.positionX + m && p.positionY === monastery.positionY + n) === undefined)closed = false;
                        }
                    }
                    if(closed){
                        meepleIdsToRemove.push(monastery.id);
                        const ix = modifiedPlayers.findIndex(p => p.id === monastery.playerId);
                        if(ix > -1){
                            modifiedPlayers[ix] = {...modifiedPlayers[ix], numberOfMeeples: modifiedPlayers[ix].numberOfMeeples + 1, score: modifiedPlayers[ix].score + 9};
                        }
                    }
                }    

                // roads
                const closedRoads: StructureInfoType[] = currentlyPlacedPiece?.tile.roads.map(r => getInfoOfRoadOrTown(currentlyPlacedPiece, [r.sides[0]], state, "R")).filter(infor => infor.closed);
                for(let i = 0; i < closedRoads.length; i++){
                    let road = closedRoads[i];
                    if(road.meeples.length === 0) continue
                    let scoringPlayers = determineScoringPlayers(road.meeples);

                    // special validation for one road including multiple roads from this piece
                    if(meepleIdsToRemove.find(m => road.meeples.find(r => r.id === m) !== undefined) !== undefined) continue;
                    meepleIdsToRemove.push(...road.meeples.map(m => m.id));
                    const roadScore = road.sides.map(s => state.placedPieces.find(p => p.positionX === s.pieceXpos && p.positionY === s.pieceYpos)?.id).filter(onlyUnique).length;
                    road.meeples.forEach(m => {
                        const ix = modifiedPlayers.findIndex(p => p.id === m.playerId);
                        if(ix > -1){
                            modifiedPlayers[ix] = {...modifiedPlayers[ix], numberOfMeeples: modifiedPlayers[ix].numberOfMeeples + 1};
                        }
                    });

                    for(let e = 0; e < scoringPlayers.length; e++){
                        const ix = modifiedPlayers.findIndex(p => p.id === scoringPlayers[e]);
                        modifiedPlayers[ix] = {...modifiedPlayers[ix], score: modifiedPlayers[ix].score + roadScore};
                    }
                }

                // towns
                const closedTowns: StructureInfoType[] = currentlyPlacedPiece?.tile.towns.map(t => getInfoOfRoadOrTown(currentlyPlacedPiece, [t.sides[0]], state, "T")).filter(info => info.closed);
                for(let j = 0; j < closedTowns.length; j++){
                    let town = closedTowns[j];
                    if(town.meeples.length === 0) continue;
                    let scoringPlayers = determineScoringPlayers(town.meeples);
                    // special validation for one town including multiple towns from this piece
                    if(meepleIdsToRemove.find(m => town.meeples.find(r => r.id === m) !== undefined) !== undefined) continue;
                    meepleIdsToRemove.push(...town.meeples.map(m => m.id));
                    const townPieces = town.sides.map(s => state.placedPieces.find(p => p.positionX === s.pieceXpos && p.positionY === s.pieceYpos)?.id).filter(onlyUnique);
                    let townScore = townPieces.length;
                    townScore += townPieces.filter(p => state.placedPieces.find(h => h.id === p)?.tile.towns[0].bonus).length;
                    if(townScore === 2) townScore = 1;
                    townScore *= 2;
                    town.meeples.forEach(m => {
                        const ix = modifiedPlayers.findIndex(p => p.id === m.playerId);
                        if(ix > -1){
                            modifiedPlayers[ix] = {...modifiedPlayers[ix], numberOfMeeples: modifiedPlayers[ix].numberOfMeeples + 1};
                        }
                    });

                    for(let k = 0; k < scoringPlayers.length; k++){
                        const ix = modifiedPlayers.findIndex(p => p.id === scoringPlayers[k]);
                        modifiedPlayers[ix] = {...modifiedPlayers[ix], score: modifiedPlayers[ix].score + townScore};
                    }
                }
                
            }

            const stackDupe = new Stack<PieceType>(...state.unplacedPieces);

            if(stackDupe.length <= 0){

                //konec hry

                console.log("Game over");
                return state;
            }

            let cPiece = stackDupe.pop();
            let possiblePlacements = calculatePossiblePlacements(state, cPiece);

            let rotations = 0;

            const cPId = state.players.find(p => p.id !== state.currentPlayerId)?.id;
            if(!cPId) throw new Error("Invalid player id");

            while(possiblePlacements.length <= 0){
                rotations++;
                cPiece = rotatePiece(cPiece, 1);
                possiblePlacements = calculatePossiblePlacements(state, cPiece);
                if(rotations >= 4){
                    return {
                        ...state,
                        players: modifiedPlayers,
                        meeples: state.meeples.filter(m => !meepleIdsToRemove.includes(m.id)),
                        currentlyPlacedPieceId: null,
                        currentPlayerId: cPId,
                        currentPiece: cPiece,
                        unplacedPieces: stackDupe,
                        possiblePiecePlacements: [],
                        currentPieceImpossibleToPlace: true
                    }
                    
                }
            }

            return {
                ...state,
                players: modifiedPlayers,
                meeples: state.meeples.filter(m => !meepleIdsToRemove.includes(m.id)),
                currentlyPlacedPieceId: null,
                currentPlayerId: cPId,
                currentPiece: cPiece,
                unplacedPieces: stackDupe,
                possiblePiecePlacements: possiblePlacements
            }
        case GameActionTypes.GET_NEW_PIECE:
            if(!state.currentPieceImpossibleToPlace) return state;
            const stackCopy = new Stack<PieceType>(...state.unplacedPieces);

            if(stackCopy.length <= 0){

                //konec hry

                console.log("Game over");
                return state;
            }

            let cp = stackCopy.pop();
            let pp = calculatePossiblePlacements(state, cp);

            let rot = 0;

            while(pp.length <= 0){
                rot++;
                cp = rotatePiece(cp, 1);
                pp = calculatePossiblePlacements(state, cp);
                if(rot >= 4){
                    return {
                        ...state,
                        currentlyPlacedPieceId: null,
                        currentPiece: cp,
                        unplacedPieces: stackCopy,
                        possiblePiecePlacements: [],
                        currentPieceImpossibleToPlace: true
                    }
                }
            }

            return {
                ...state,
                currentlyPlacedPieceId: null,
                currentPiece: cp,
                unplacedPieces: stackCopy,
                possiblePiecePlacements: pp,
                currentPieceImpossibleToPlace: false
            }

        
        case GameActionTypes.RESET_GAME:
            const arr: PieceType[] = [];
            tilePayload.forEach(tile => {
                for(let i = 0; i < tile.value; i++) {
                    const t: PieceType = {
                        id: uuidv4(),
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
            
            let players: PlayerType[] = []
            const settingsContext = useContext(SettingsContext);

            if(settingsContext.state.typeOfGame === TypeOfGame.PVP){
                players.push({id: uuidv4(), name: settingsContext.state.firstName, score: 0, meepleColor: settingsContext.state.firstColor, numberOfMeeples: 8})
                players.push({id: uuidv4(), name: settingsContext.state.secondName, score: 0, meepleColor: settingsContext.state.secondColor, numberOfMeeples: 8})
                console.log("pushing")
            }
            else if(settingsContext.state.typeOfGame === TypeOfGame.PVC){
                // TODO
            }

            return {
                ...initialGameReducerState,
                unplacedPieces: stack,
                currentPiece: currentPiece,
                currentPlayerId: players[0].id,
                possiblePiecePlacements: [[...firstPiecePosition]],
                players: players
            };
        default:
            return state;
    }
}

const initialGameReducerState: GameState = {
    meeples: [],
    placedPieces: [],
    currentPiece: null,
    currentPieceImpossibleToPlace: false,
    currentlyPlacedPieceId: null,
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

    piece1fields.forEach(field1 => {
        if(piece2fields.find(field2 => field2 === field1) === undefined) return false;
    });
    piece2fields.forEach(field2 => {
        if(piece1fields.find(field1 => field1 === field2) === undefined) return false;
    });

    return true;
}

type PieceSidePair = {
    pieceXpos: number,
    pieceYpos: number,
    side: number[]
}

type StructureInfoType = {
    type: "T" | "R",
    meeples: MeepleType[],
    closed: boolean,
    sides: PieceSidePair[]
}

// getInfoOfRoadOrTown returns information about the road or town that the side is a part of
// type = "R" for road, "T" for town
// side = side of the piece that is being checked in format [n] where n is the side number, side.length must be 1
// visitedSides = array of objects that contain information about the visited sides of the pieces, used for recursion
export const getInfoOfRoadOrTown = (piece: PieceType, side: number[], state: GameState, type: "R" | "T", visitedSides: PieceSidePair[] = []): StructureInfoType => {

    if(type !== "R" && type !== "T") throw new Error("Invalid type");
    let structure: RoadType | TownType | undefined;
    if(type === "R"){
        structure = piece.tile.roads.find(r => r.sides.find(s => s === side[0]) !== undefined);
    }else{
        structure = piece.tile.towns.find(t => t.sides.find(s => s === side[0]) !== undefined);
    }
    
    if(!structure) throw new Error("Invalid side");

    let answer: MeepleType[] = [];
    let closed = true;
    structure.sides.forEach(s => {
        if(visitedSides.find(v => v.pieceXpos === piece.positionX && v.pieceYpos === piece.positionY && v.side.find(a => a === s) !== undefined) !== undefined) {}
        else{
            const meeple = state.meeples.find(m => m.positionX === piece.positionX && m.positionY === piece.positionY && m.positionInPiece.length === 1 && m.positionInPiece[0] === s)
            if(meeple !== undefined){
                answer.push(meeple);
            }
            let nextPieceCoords: number[] = [];
            let nextSide: number[] = [];
            switch(s){
                case 1:
                    nextPieceCoords = [piece.positionX, piece.positionY + 1];
                    nextSide = [3];
                    break;
                case 2:
                    nextPieceCoords = [piece.positionX - 1, piece.positionY];
                    nextSide = [4];
                    break;
                case 3:
                    nextPieceCoords = [piece.positionX, piece.positionY - 1];
                    nextSide = [1];
                    break;
                case 4:
                    nextPieceCoords = [piece.positionX + 1, piece.positionY];
                    nextSide = [2];
                    break;
                default:
                    throw new Error("Invalid side");
            }
            const nextPiece = state.placedPieces.find(p => p.positionX === nextPieceCoords[0] && p.positionY === nextPieceCoords[1]);
            visitedSides.push({pieceXpos: piece.positionX, pieceYpos: piece.positionY, side: [s]});
            if(nextPiece){
                const recursionResult = getInfoOfRoadOrTown(nextPiece, nextSide, state,type, visitedSides);
                answer.push(...recursionResult.meeples);
                closed = closed && recursionResult.closed;
            }else{
                closed = false;
            }
        }
    });
    return {
        type: type,
        meeples: answer,
        closed: closed,
        sides: visitedSides
    };
}

export const isFieldEmpty = (piece: PieceType, side: number[], state: GameState, visitedSides: PieceSidePair[] = []): boolean => {

    if(side.length !== 2) throw new Error("Invalid side");
    let field = piece.tile.fields.find(f => f.sides.find(s => s[0] === side[0] && s[1] == side[1]) !== undefined);
    if(!field) throw new Error("Invalid side");

    for(let i = 0; i < field.sides.length; i++){
        let s = field.sides[i];
        if(visitedSides.find(v => v.pieceXpos === piece.positionX && v.pieceYpos === piece.positionY && v.side[0] === s[0] && v.side[1] === s[1]) !== undefined) {}
        else{
            if(state.meeples.find(m => m.positionX === piece.positionX && m.positionY === piece.positionY && m.positionInPiece.length === 2 && m.positionInPiece[0] === s[0] && m.positionInPiece[1] === s[1]) !== undefined){
                return false;
            }
            let nextPieceCoords: number[] = [];
            let nextSide: number[] = [];
            switch(s[0]){
                case 1:
                    nextPieceCoords = [piece.positionX, piece.positionY + 1];
                    nextSide = [3];
                    break;
                case 2:
                    nextPieceCoords = [piece.positionX - 1, piece.positionY];
                    nextSide = [4];
                    break;
                case 3:
                    nextPieceCoords = [piece.positionX, piece.positionY - 1];
                    nextSide = [1];
                    break;
                case 4:
                    nextPieceCoords = [piece.positionX + 1, piece.positionY];
                    nextSide = [2];
                    break;
                default:
                    throw new Error("Invalid side");
            }
            nextSide.push(s[1]%2 + 1);
            const nextPiece = state.placedPieces.find(p => p.positionX === nextPieceCoords[0] && p.positionY === nextPieceCoords[1]);
            visitedSides.push({pieceXpos: piece.positionX, pieceYpos: piece.positionY, side: s});
            if(nextPiece){
                if(!isFieldEmpty(nextPiece, nextSide, state, visitedSides)){
                    return false;
                }
            }
        }
    };
    return true;

}

type DictionaryPair = {
    key: string,
    value: number
}

const determineScoringPlayers = (meeples: MeepleType[]): string[] => {

    if(meeples.length === 1) return [meeples[0].playerId];

    const playerIds = meeples.map(m => m.playerId);
    let d: DictionaryPair[] = [];

    let max = 1;

    playerIds.forEach((id) => {
        const index = d.findIndex(p => p.key === id);
        if(index !== -1){
            d[index].value = d[index].value + 1;
            max = Math.max(max, d[index].value);
        }else{
            d.push({key: id, value: 1});
        }
    });

    return d.filter(p => p.value === max).map(a => a.key);
}