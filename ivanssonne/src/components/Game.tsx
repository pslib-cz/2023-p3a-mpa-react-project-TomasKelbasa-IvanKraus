import React, { useContext, useRef } from 'react';
import Board from './Board';
import { GameActionTypes, GameContext } from '../providers/GameProvider';
import Piece from './Piece';
import { tilePayload } from '../../data/tile_type';
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

    return (
        <div>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handlePassTurn}>Pass turn</button>
            <Board />

            <aside>
                <h2>Your piece</h2>
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