import React, { useContext, useEffect, useRef } from 'react';
import Board from './Board';
import { GameContext, PieceSidePair, GameState, GameAction } from '../providers/GameProvider';
import Piece from './Piece';
import styles from './styles/Game.module.scss';
import star from '../assets/star-icon.svg';
import home from '../assets/home-icon.svg';
import { useNavigate } from 'react-router-dom';
import { meeples } from '../assets/meeples.tsx';
import { MeepleColors } from '../providers/SettingsProvider.tsx';
import { determineScoringPlayers, getInfoOfField, getInfoOfRoadOrTown, onlyUnique, endOfTurn, GameActionTypes } from '../providers/utilities.tsx';

interface GameProps {}

const finalScoring = (state: GameState, dispatch: React.Dispatch<GameAction>): void => {

    const copy = {...state};
    const evaluatedMeeplesIds: string[] = [];
    const fieldMeeplesIds: string[] = [];
    state.meeples.forEach(meeple => {

        // skip if meeple has already been evaluated
        if(evaluatedMeeplesIds.find(id => id === meeple.id) !== undefined) return;

        const piece = state.placedPieces.find(p => p.positionX === meeple.positionX && p.positionY === meeple.positionY);
        // monastery
        if(piece?.tile.monastery && meeple.positionInPiece.length === 1 && meeple.positionInPiece[0] === 5){
            let score = 0;
            for(let m = -1; m <= 1; m++){
                for(let n = -1; n <= 1; n++){
                    if(state.placedPieces.find(p => p.positionX === piece.positionX + m && p.positionY === piece.positionY + n) !== undefined) score++;
                }
            }
            copy.players.map(p => {
                if(p.id === meeple.playerId){
                    dispatch({type: GameActionTypes.REWARD_PLAYER, playerId: p.id, score: score, message: ` získal ${score} bodů za nedokončený klášter.`})
                }
                return p;
            });
        }
        // fields for later
        else if (meeple.positionInPiece.length === 2){
            fieldMeeplesIds.push(meeple.id);
            return;
        }
        else{
            // roads
            if(piece?.tile.roads.find(r => r.sides.find(s => s === meeple.positionInPiece[0]) !== undefined) !== undefined){
                const info = getInfoOfRoadOrTown(piece, meeple.positionInPiece, state, "R");
                const scoringPlayers = determineScoringPlayers(info.meeples);

                const score = info.sides.map(a => `${a.pieceXpos}, ${a.pieceYpos}`).filter(onlyUnique).length;

                // rewards players
                scoringPlayers.forEach(sp => {
                    copy.players.map(p => {
                        if(p.id === sp){
                            dispatch({type: GameActionTypes.REWARD_PLAYER, playerId: p.id, score: score, message: ` získal ${score} bodů za nedokončenou cestu.`})
                        }
                        return p;
                    });
                });
                
            }
            // towns
            else if(piece?.tile.towns.find(t => t.sides.find(s => s === meeple.positionInPiece[0]) !== undefined) !== undefined){
                const info = getInfoOfRoadOrTown(piece, meeple.positionInPiece, state, "T");
                const scoringPlayers = determineScoringPlayers(info.meeples);

                // 1 point for each piece of the town
                let score = info.sides.map(a => `${a.pieceXpos}, ${a.pieceYpos}`).filter(onlyUnique).length;

                const bonusPiecesIds: string[] = [];

                // searches for towns with erb (bonus) and adds the piece id to the bonusPiecesIds array
                info.sides.forEach(s => {
                    const p = state.placedPieces.find(p => p.positionX === s.pieceXpos && p.positionY === s.pieceYpos);
                    if(p?.tile.towns.find(t => t.sides.find(side => side === s.side[0]) !== undefined)?.bonus){
                        bonusPiecesIds.push(p.id);
                    }
                });

                // 1 extra point for each erb in the town
                score += bonusPiecesIds.filter(onlyUnique).length;

                // rewards players
                scoringPlayers.forEach(sp => {
                    copy.players.map(p => {
                        if(p.id === sp){
                            dispatch({type: GameActionTypes.REWARD_PLAYER, playerId: p.id, score: score, message: ` získal ${score} bodů za nedokončené město.`})
                        }
                        return p;
                    });
                });
            }
        }

    });


    const solvedFieldMeepleIds: string[] = [];

    fieldMeeplesIds.forEach(meepleId => {
        // skip if meeple has already been evaluated
        if(solvedFieldMeepleIds.find(id => id === meepleId) !== undefined) return;

        const meeple = state.meeples.find(m => m.id === meepleId);
        const piece = state.placedPieces.find(p => p.positionX === meeple?.positionX && p.positionY === meeple?.positionY);
        if(!piece) return;
        if(!meeple) return;

        const info = getInfoOfField(piece.id, meeple.positionInPiece, state);
        console.log(info);
        // adds all meeples on the field to the solvedFieldMeepleIds array
        solvedFieldMeepleIds.push(...info.meeples.map(m => m.id));

        // determines the scoring players based on number of meeples on the field
        const scoringPlayers = determineScoringPlayers(info.meeples);

        const calculatedTownSides: PieceSidePair[] = [];

        let score = 0;

        info.sides.forEach(s => {
            const p = state.placedPieces.find(p => p.positionX === s.pieceXpos && p.positionY === s.pieceYpos);
            const newSide = (s.side[0] + (s.side[1] === 2 ? 1 : -1) - 1) % 4 + 1;

            // checks if the side has already been calculated - if so, then there is no need to calculate it again (it would lead to double or more points for the same town)
            if(calculatedTownSides.find(c => c.pieceXpos === s.pieceXpos && c.pieceYpos === s.pieceYpos
                && c.side.find(a => a === newSide) !== undefined) !== undefined) return;

            // checks if there is a town on newSide
            if(p?.tile.towns.find(t => t.sides.find(side => side === newSide) !== undefined) !== undefined){

                const tonwInfo = getInfoOfRoadOrTown(p, [newSide], state, "T");
                calculatedTownSides.push(...tonwInfo.sides);

                if(!tonwInfo.closed) return;
                else score += 1;
            }
        });

        // 3 points for each closed town
        score *= 3;

        // rewards players
        scoringPlayers.forEach(sp => {
            copy.players.map(p => {
                if(p.id === sp){
                    dispatch({type: GameActionTypes.REWARD_PLAYER, playerId: p.id, score: score, message: ` získal ${score} bodů za nedokončené pole.`})
                }
                return p;
            });
        });
    });
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
        finalScoring(gameContext.state, gameContext.dispatch);
        gameContext.dispatch({type: GameActionTypes.END_GAME});
    };

    useEffect(() => {
        gameContext.dispatch({type: GameActionTypes.RESET_GAME});
    }, []);

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
    const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    }, [gameContext.state.messageLog]); 
    


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
                                    {player.score === Math.max(...gameContext.state.players.map(p => p.score)) ? (
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
      
            <div className={styles["aside__logger"]} style={{ border: `3px solid ${currentPlayerColor}` }}>
                <ul>
                    {gameContext.state.messageLog.map((log, index) => (
                        <li key={index} dangerouslySetInnerHTML={{__html: log}}></li>
                    ))}
                    <div ref={endOfMessagesRef} /> 
                </ul>
            </div>

        </div>
    );
};

export default Game;
