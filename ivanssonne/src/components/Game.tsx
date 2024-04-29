import React, { useContext, useEffect } from 'react';
import Board from './Board';
import { GameActionTypes, GameContext, getInfoOfRoadOrTown, StructureInfoType, determineScoringPlayers, GameContextType } from '../providers/GameProvider';
import Piece from './Piece';
import styles from './styles/Game.module.scss';
import star from '../assets/star-icon.svg';
import home from '../assets/home-icon.svg';
import { useNavigate } from 'react-router-dom';
import music from '../assets/sound-icon.svg';
import { meeples } from '../assets/meeples.tsx';
import { MeepleColors } from '../providers/SettingsProvider.tsx';

interface GameProps {}

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
    
    meepleIdsToRemove.forEach(meepleId => {
        gameContext.dispatch({type: GameActionTypes.REMOVE_MEEPLE, meepleId});
    });
    
    gameContext.dispatch({type: GameActionTypes.END_TURN});
}

const Game: React.FC<GameProps> = () => {
    const gameContext = useContext(GameContext);

    const handlePassTurn = () => {
        endOfTurn(gameContext);
    };


    const handleRotateRight = () => {
        gameContext.dispatch({type: GameActionTypes.ROTATE_CURRENT_PIECE, direction: 'right'});
    };

    const handleGetNewPiece = () => {
        gameContext.dispatch({type: GameActionTypes.GET_NEW_PIECE});
    };

    const handleEndGame = () => {
        gameContext.dispatch({type: GameActionTypes.END_GAME});
    };

    useEffect(() => {
        gameContext.dispatch({type: GameActionTypes.RESET_GAME});
    }, []);

    const sortedPlayers = () => {
        const { players, currentPlayerId } = gameContext.state;
        return [
            ...players.filter(p => p.id === currentPlayerId),
            ...players.filter(p => p.id !== currentPlayerId)
        ];
    };
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    function getMeepleImage(color: MeepleColors): string {
        let meeplePath;
        switch(color){
            case "BLACK":
                meeplePath = meeples.SBLACK;
                break;
            case "BLUE":
                meeplePath = meeples.SBLUE;
                break;
            case "GREEN":
                meeplePath = meeples.SGREEN;
                break;
            case "RED":
                meeplePath = meeples.SRED;
                break;
            case "YELLOW":
                meeplePath = meeples.SYELLOW;
                break;
            default:
                meeplePath = meeples.SBLACK;
                console.log("Invalid color");
                break;    
        }
        return meeplePath;
    }


    const players = gameContext.state.players;
    const firstPlayerColor = players.length > 0 ? players[0].meepleColor : 'transparent';
    const secondPlayerColor = players.length > 1 ? players[1].meepleColor : 'transparent';
    const gradientDirection = 'to bottom';
    const currentPlayerColor = gameContext.state.players.find(player => player.id === gameContext.state.currentPlayerId)?.meepleColor || 'transparent';

    return (
        <div className={styles["game"]}>
            {gameContext.state.showResult ? 
                <div className={styles["game__win_overlay"]}>
                    <div className={styles["win_overlay"]}>
                        <h1 className={styles["overlay__title"]}>Konec hry</h1>
                        {gameContext.state.players.every(player => player.score === gameContext.state.players[0].score) ? (
                            <h2 className={styles["content__draw"]}>Remíza</h2>
                            
                        ) : (
                            gameContext.state.players.map((player, index) => (
                                <div className={styles["overlay__content"]} key={index}>
                                    {index === 0 ? (
                                        <p className={styles["content__player"]}>Vítěz: {player.name}</p>
                                    ) : (
                                        <p className={styles["content__player"]}>Prohra: {player.name}</p>
                                    )}
                                    <p className={styles["content__score"]}>Skóre: {player.score}</p>
                                </div>
                            ))
                        )}
                        <button onClick={handleGoHome}>Domů</button>
                    </div>
                </div>
            : null}
            <Board />
            <button className={styles["button_home"]} onClick={handleGoHome}><img src={home} alt='Domů'></img></button>
            <aside className={styles["game__aside"]}>
                <div className={styles["aside__players"]} style={{ background: `linear-gradient(${gradientDirection}, ${firstPlayerColor}, ${secondPlayerColor})` }}>
                    <div className={styles["content"]}>
                        {gameContext.state.players.map(player => (
                            <div className={styles["player"]} key={player.id} style={{ opacity: player.id !== gameContext.state.currentPlayerId ? 0.2 : 1 }}>
                                <h3>{player.name}</h3>
                                <div className={styles["player__stats"]}>
                                    <div>
                                        <p>{player.numberOfMeeples}×</p>
                                        <img
                                            className={styles["meeple_icon"]}
                                            src={getMeepleImage(player.meepleColor)}
                                            alt="Meeple"
                                        />
                                    </div>
                                    <p><img className={styles["star_icon"]} src={star}></img> {player.score}</p>
                                </div>
                            </div>
                        ))}

                        <div className={styles["settings"]}>
                            <div>
                                {
                                    gameContext.state.gameEnded
                                    ? 
                                    <button className={styles["button_endgame"]} onClick={handleEndGame}>Vyhodnocení</button>
                                    :
                                    (
                                    gameContext.state.currentPiece === null && gameContext.state.currentlyPlacedPieceId !== null
                                    ?
                                    <button className={styles["button_passturn"]} onClick={handlePassTurn}>Ukončit tah</button>
                                    :
                                    <button className={styles["button_passturn--unactive"]} onClick={handlePassTurn}>Ukončit tah</button>
                                    )
                                }
                            </div>
                                <p className={styles["left_pieces"]}>Zbývajících dílků: <span>{gameContext.state.unplacedPieces.length}</span></p>
                        </div>
                    </div>
                </div>
                {
                    (gameContext.state.gameEnded) ? null :
                    <div className={styles["aside__tile"]} style={{ border: `3px solid ${currentPlayerColor}` }}>
                        <button className={styles["rotate"]} onClick={handleRotateRight}>Rotate</button>
                            <div style={{width: "100px", height: "100px"}}>
                                {gameContext.state.currentPiece ? <Piece piece={gameContext.state.currentPiece} /> : <p className={styles["notile"]}></p>}
                            </div>
                            {
                                gameContext.state.currentPieceImpossibleToPlace ? 
                                <div className={styles["cant_put"]}>
                                    <p>Nelze položit tento dílek.</p>
                                    <button onClick={handleGetNewPiece}>Vzít si jiný dílek.</button>
                                </div>
                                :
                                null
                            }
                    </div>
                }
            </aside>
        </div>
    );
};

export default Game;
