import { RoadType, TownType } from "../data/tile_type";
import { GameState, MeepleType, PieceSidePair, StructureInfoType } from "./GameProvider";
import { PieceType } from "../components/Piece";
import { GameContextType } from "./GameProvider";


export enum DndTypes {
    PIECE = "piece"
}

export enum GameActionTypes {
    RESET_GAME,
    PLACE_PIECE,
    PLACE_MEEPLE,
    END_TURN,
    GET_NEW_PIECE,
    ROTATE_CURRENT_PIECE,
    REWARD_PLAYER,
    REMOVE_MEEPLE,
    END_GAME
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

    const answer: MeepleType[] = [];
    let closed = true;
    structure.sides.forEach(s => {
        if(!(visitedSides.find(v => v.pieceXpos === piece.positionX && v.pieceYpos === piece.positionY && v.side.find(a => a === s) !== undefined) !== undefined)){
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
    const field = piece.tile.fields.find(f => f.sides.find(s => s[0] === side[0] && s[1] == side[1]) !== undefined);
    if(!field) throw new Error("Invalid side");

    for(let i = 0; i < field.sides.length; i++){
        const s = field.sides[i];
        if(!(visitedSides.find(v => v.pieceXpos === piece.positionX && v.pieceYpos === piece.positionY && v.side[0] === s[0] && v.side[1] === s[1]) !== undefined)){
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
    }
    return true;

}

type DictionaryPair = {
    key: string,
    value: number
}

export const determineScoringPlayers = (meeples: MeepleType[]): string[] => {

    if(meeples.length === 1) return [meeples[0].playerId];

    const playerIds = meeples.map(m => m.playerId);
    const d: DictionaryPair[] = [];

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

type FieldInfoType = {
    meeples: MeepleType[],
    sides: PieceSidePair[]
}

export const onlyUnique = (value:any, index:number, array:any[]) => {
    if(value === null || value === undefined) return false;
    return array.indexOf(value) === index;
}

// uses recursion
// gets all sides of the field and all meeples on the field
export const getInfoOfField = (pieceId: string, side: number[], state: GameState, visitedSides: PieceSidePair[] = []): FieldInfoType => {

    const piece = state.placedPieces.find(p => p.id === pieceId);
    if(!piece) throw new Error("Invalid piece id");

    const field = piece.tile.fields.find(f => f.sides.find(s => s[0] === side[0] && s[1] == side[1]) !== undefined);

    if(!field) throw new Error("Invalid side");

    const meeples: MeepleType[] = [];

    field.sides.forEach(s => {

        // if side has already been visited, skip
        if(visitedSides.find(v => v.pieceXpos === piece.positionX && v.pieceYpos === piece.positionY 
            && v.side[0] === s[0] && v.side[1] === s[1]) !== undefined) return;

        // searches for meeple on the side of piece
        const meeple = state.meeples.find(m => m.positionX === piece.positionX && m.positionY === piece.positionY && m.positionInPiece.length === 2 && m.positionInPiece[0] === s[0] && m.positionInPiece[1] === s[1]);
        if(meeple) meeples.push(meeple);


        let nextPieceCoords: number[] = [];
        let nextSide: number[] = [];

        // calculates the next piece coordinates and the side of the next piece that is connected to the current piece
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

        // the nextSide has to be the opposite of the current side
        nextSide.push(s[1]%2 + 1);

        visitedSides.push({pieceXpos: piece.positionX, pieceYpos: piece.positionY, side: s});
        const nextPiece = state.placedPieces.find(p => p.positionX === nextPieceCoords[0] && p.positionY === nextPieceCoords[1]);
        if(nextPiece){
            const recursionResult = getInfoOfField(nextPiece.id, nextSide, state, visitedSides);
            meeples.push(...recursionResult.meeples);
        }
        
    });

    return {
        meeples: meeples.map(m => m.id).filter(onlyUnique).map(id => state.meeples.find(m => m.id === id) as MeepleType),
        sides: visitedSides
    };
}

export const endOfTurn = (gameContext: GameContextType) => {
    
    const currentlyPlacedPiece = gameContext.state.placedPieces.find(p => p.id === gameContext.state.currentlyPlacedPieceId);
    const meepleIdsToRemove: string[] = [];

    if(!currentlyPlacedPiece) console.error("Ivan je ivan")
        // monestaries
    const monasteries = gameContext.state.meeples.filter(m => m.positionInPiece[0] === 5);
    for(let q = 0; q < monasteries.length; q++){
        const monastery = monasteries[q];
        let closed = true;
        for(let m = -1; m <= 1; m++){
            for(let n = -1; n <= 1; n++){
                if(gameContext.state.placedPieces.find(p => p.positionX === monastery.positionX + m && p.positionY === monastery.positionY + n) === undefined)closed = false;
            }
        }
        if(closed){
            meepleIdsToRemove.push(monastery.id);
            gameContext.dispatch({type: GameActionTypes.REWARD_PLAYER, playerId: monastery.playerId, score: 9, message: ` získal 9 bodů za dokončený klášter.`});
        }
    }    

    // roads
    const closedRoads: StructureInfoType[] = currentlyPlacedPiece?.tile.roads.map(r => getInfoOfRoadOrTown(currentlyPlacedPiece, [r.sides[0]], gameContext.state, "R")).filter(infor => infor !== undefined && infor.closed) ?? [];
    for(let i = 0; i < closedRoads.length; i++){
        const road = closedRoads[i];
        if(road.meeples.length === 0) continue
        const scoringPlayers = determineScoringPlayers(road.meeples);

        // special validation for one road including multiple roads from this piece
        if(meepleIdsToRemove.find(m => road.meeples.find(r => r.id === m) !== undefined) !== undefined) continue;
        meepleIdsToRemove.push(...road.meeples.map(m => m.id));
        const roadScore = road.sides.map(s => gameContext.state.placedPieces.find(p => p.positionX === s.pieceXpos && p.positionY === s.pieceYpos)?.id).filter(onlyUnique).length;

        for(let e = 0; e < scoringPlayers.length; e++){
            gameContext.dispatch({type: GameActionTypes.REWARD_PLAYER, playerId: scoringPlayers[e], score: roadScore, message: ` získal ${roadScore} ${(roadScore < 5 ? "body" : "bodů")} za dokončenou cestu.`});
        }
    }

    // towns
    const closedTowns: StructureInfoType[] = currentlyPlacedPiece?.tile.towns.map(t => getInfoOfRoadOrTown(currentlyPlacedPiece, [t.sides[0]], gameContext.state, "T")).filter(info => info.closed) ?? [];
    for(let j = 0; j < closedTowns.length; j++){
        const town = closedTowns[j];
        if(town.meeples.length === 0) continue;
        const scoringPlayers = determineScoringPlayers(town.meeples);
        // special validation for one town including multiple towns from this piece
        if(meepleIdsToRemove.find(m => town.meeples.find(r => r.id === m) !== undefined) !== undefined) continue;
        meepleIdsToRemove.push(...town.meeples.map(m => m.id));
        const townPieces = town.sides.map(s => gameContext.state.placedPieces.find(p => p.positionX === s.pieceXpos && p.positionY === s.pieceYpos)?.id).filter(onlyUnique);
        let townScore = townPieces.length;
        townScore += townPieces.filter(p => gameContext.state.placedPieces.find(h => h.id === p)?.tile.towns[0].bonus).length;
        if(townScore === 2) townScore = 1;
        townScore *= 2;

        for(let k = 0; k < scoringPlayers.length; k++){
            gameContext.dispatch({type: GameActionTypes.REWARD_PLAYER, playerId: scoringPlayers[k], score: townScore, message: ` získal ${townScore} ${(townScore < 5 ? "body" : "bodů")} za dokončené město.`});
        }
    }
    
    meepleIdsToRemove.forEach(meepleId => {
        gameContext.dispatch({type: GameActionTypes.REMOVE_MEEPLE, meepleId});
    });
    
    gameContext.dispatch({type: GameActionTypes.END_TURN});
}