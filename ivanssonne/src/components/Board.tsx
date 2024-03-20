import React, { useContext } from 'react';
import styles from './Board.module.scss';
import { tileTypes } from '../../data/tile_type';
import Piece, { PieceType } from './Piece';
import { GameContext } from '../providers/GameProvider';

interface BoardProps {
    // Define props here
}

const Board: React.FC<BoardProps> = () => {
    // Implement component logic here

    const test = {
        id: 'test',
        placed: true,
        rotation: 0,
        positionX: 5,
        positionY: 2,
        tile: tileTypes[5]
      }

    const gridTemplateColumns = "repeat(100, 100px)";
    const gridTemplateRows = "repeat(100, 100px)";

    const gameContext = useContext(GameContext);

    return (
        <div className={styles["board"]} style={{gridTemplateColumns: gridTemplateColumns, gridTemplateRows: gridTemplateRows}}>
           {
            gameContext.state.placedPieces.map((piece: PieceType) => {
                return <Piece key={piece.id} piece={piece} />
            })
           }
        </div>
    );
};

export default Board;