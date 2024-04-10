import React, { useContext, useEffect } from 'react';
import Board from './Board';
import { GameActionTypes, GameContext, getInfoOfRoadOrTown, StructureInfoType, determineScoringPlayers, GameContextType } from '../providers/GameProvider';
import Piece from './Piece';
import styles from './styles/Game.module.scss';

interface GameProps {
    // Define your props here
}

function onlyUnique(value:any, index:number, array:any[]) {
    if(value === null || value === undefined) return false;
    return array.indexOf(value) === index;
}

export const endOfTurn = (gameContext: GameContextType) => {
    
    const currentlyPlacedPiece = gameContext.state.placedPieces.find(p => p.id === gameContext.state.currentlyPlacedPieceId);
    const meepleIdsToRemove: string[] = [];

    if(!currentlyPlacedPiece) console.error("Ivan je ivan")
        // monestaries
    const monasteries = gameContext.state.meeples.filter(m => m.positionInPiece[0] === 5);
    for(let q = 0; q < monasteries.length; q++){
        let monastery = monasteries[q];
        let closed = true;
        for(let m = -1; m <= 1; m++){
            for(let n = -1; n <= 1; n++){
                if(gameContext.state.placedPieces.find(p => p.positionX === monastery.positionX + m && p.positionY === monastery.positionY + n) === undefined)closed = false;
            }
        }
        if(closed){
            meepleIdsToRemove.push(monastery.id);
            gameContext.dispatch({type: GameActionTypes.REWARD_PLAYER, playerId: monastery.playerId, score: 9});
        }
    }    

    // roads
    const closedRoads: StructureInfoType[] = currentlyPlacedPiece?.tile.roads.map(r => getInfoOfRoadOrTown(currentlyPlacedPiece, [r.sides[0]], gameContext.state, "R")).filter(infor => infor !== undefined && infor.closed) ?? [];
    for(let i = 0; i < closedRoads.length; i++){
        let road = closedRoads[i];
        if(road.meeples.length === 0) continue
        let scoringPlayers = determineScoringPlayers(road.meeples);

        // special validation for one road including multiple roads from this piece
        if(meepleIdsToRemove.find(m => road.meeples.find(r => r.id === m) !== undefined) !== undefined) continue;
        meepleIdsToRemove.push(...road.meeples.map(m => m.id));
        const roadScore = road.sides.map(s => gameContext.state.placedPieces.find(p => p.positionX === s.pieceXpos && p.positionY === s.pieceYpos)?.id).filter(onlyUnique).length;

        for(let e = 0; e < scoringPlayers.length; e++){
            gameContext.dispatch({type: GameActionTypes.REWARD_PLAYER, playerId: scoringPlayers[e], score: roadScore});
        }
    }

    // towns
    const closedTowns: StructureInfoType[] = currentlyPlacedPiece?.tile.towns.map(t => getInfoOfRoadOrTown(currentlyPlacedPiece, [t.sides[0]], gameContext.state, "T")).filter(info => info.closed) ?? [];
    for(let j = 0; j < closedTowns.length; j++){
        let town = closedTowns[j];
        if(town.meeples.length === 0) continue;
        let scoringPlayers = determineScoringPlayers(town.meeples);
        // special validation for one town including multiple towns from this piece
        if(meepleIdsToRemove.find(m => town.meeples.find(r => r.id === m) !== undefined) !== undefined) continue;
        meepleIdsToRemove.push(...town.meeples.map(m => m.id));
        const townPieces = town.sides.map(s => gameContext.state.placedPieces.find(p => p.positionX === s.pieceXpos && p.positionY === s.pieceYpos)?.id).filter(onlyUnique);
        let townScore = townPieces.length;
        townScore += townPieces.filter(p => gameContext.state.placedPieces.find(h => h.id === p)?.tile.towns[0].bonus).length;
        if(townScore === 2) townScore = 1;
        townScore *= 2;

        for(let k = 0; k < scoringPlayers.length; k++){
            gameContext.dispatch({type: GameActionTypes.REWARD_PLAYER, playerId: scoringPlayers[k], score: townScore});
        }
    }
    
    meepleIdsToRemove.forEach(m => {
        gameContext.dispatch({type: GameActionTypes.REMOVE_MEEPLE, meepleId: m});
    });
    
    gameContext.dispatch({type: GameActionTypes.END_TURN});
}

const Game: React.FC<GameProps> = () => {
    
    
    const gameContext = useContext(GameContext);

    const handlePassTurn = () => {
        endOfTurn(gameContext);
    }

    const handleReset = () => {
        gameContext.dispatch({type: GameActionTypes.RESET_GAME});
    }

    const handleRotateRight = () => {
        gameContext.dispatch({type: GameActionTypes.ROTATE_CURRENT_PIECE, direction: 'right'});
    }

    const handleGetNewPiece = () => {
        gameContext.dispatch({type: GameActionTypes.GET_NEW_PIECE});
    }

    useEffect(() => {
        gameContext.dispatch({type: GameActionTypes.RESET_GAME});
    }, []);

    return (
        <div className={styles["game"]}>
            <Board />
            <aside>
                <button onClick={handleReset}>Reset</button>
                <div>
                    <h2>Players</h2>
                    {
                        gameContext.state.players.map(player =>                     
                            <div>
                                <h3>{player.name}{(gameContext.state.currentPlayerId === player.id ? " - playing" : null)}</h3>
                                <p>Meeples: {player.numberOfMeeples}</p>
                                <p>Score: {player.score}</p>
                                <p>Color: {player.meepleColor}</p>
                            </div>
                        )
                    }


                </div>
                <h2>Your piece</h2>
                <p>{gameContext.state.unplacedPieces.length} other pieces remains</p>
                <div style={{width: "100px", height: "100px"}}>
                    {
                        (gameContext.state.currentPiece !== null) ? <Piece piece={gameContext.state.currentPiece} /> : <p>No piece</p>
                    }
                </div>
                <button onClick={handleRotateRight}>Rotate</button>
                {
                    (gameContext.state.currentPieceImpossibleToPlace)
                    ?
                    <div>
                        <p>Impossible to place</p>
                        <button onClick={handleGetNewPiece}>Get other piece</button>
                    </div>
                    :
                    null
                }
                {
                    (gameContext.state.currentPiece === null && gameContext.state.currentlyPlacedPieceId !== null)
                    ?
                    <button onClick={handlePassTurn}>Pass turn</button>
                    :
                    null
                }
            </aside>
        </div>
    );
};

export default Game;