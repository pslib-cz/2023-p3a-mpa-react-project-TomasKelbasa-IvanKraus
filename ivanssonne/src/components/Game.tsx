import React, { useContext, useEffect } from 'react';
import Board from './Board';
import { GameActionTypes, GameContext } from '../providers/GameProvider';
import Piece from './Piece';
import { tilePayload } from '../../data/tile_type';
import styles from './Game.module.scss';
interface GameProps {
    // Define your props here
}

const Game: React.FC<GameProps> = (props) => {
    
    const gameContext = useContext(GameContext);

    const handleReset = () => {
        gameContext.dispatch({type: GameActionTypes.RESET_GAME});
    }

    const handleRotateRight = () => {
        gameContext.dispatch({type: GameActionTypes.ROTATE_CURRENT_PIECE, direction: 'right'});
    }

    const handlePassTurn = () => {
        gameContext.dispatch({type: GameActionTypes.END_TURN});
    }

    useEffect(() => {
        gameContext.dispatch({type: GameActionTypes.RESET_GAME});
    }, []);

    return (
        <div className={styles["game"]}>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handlePassTurn}>Pass turn</button>
            <Board />

            <aside>
                <div>
                    <h2>Players</h2>
                    {
                        gameContext.state.players.map(player =>                     
                            <div>
                                <h3>{player.name}</h3>
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
                
            </aside>
        </div>
    );
};

export default Game;