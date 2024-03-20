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


    const inputX = useRef<HTMLInputElement>(null);
    const inputY = useRef<HTMLInputElement>(null);

    const handlePlacePiece = () => {
        if(inputX.current && inputY.current && Number(inputX.current.value) > 0 && Number(inputY.current.value) > 0) {
            gameContext.dispatch({type: GameActionTypes.PLACE_PIECE, locationX: parseInt(inputX.current.value), locationY: parseInt(inputY.current.value)});

            
        }
    }

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
            <div>
                <input type='number' ref={inputX} />
                <input type='number' ref={inputY} />
                <button onClick={handlePlacePiece} >Place piece</button>
            </div>
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