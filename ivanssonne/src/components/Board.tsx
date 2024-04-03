import React, { useContext } from 'react';
import styles from './styles/Board.module.scss';
import { tileTypes } from '../../data/tile_type';
import Piece, { PieceType } from './Piece';
import { GameContext } from '../providers/GameProvider';
import EmptyPiece from './EmptyPiece';

interface BoardProps {
    // Define props here
}

const Board: React.FC<BoardProps> = () => {
    // Implement component logic here

    const boardWidth = 50;
    const boardHeight = 50;

    const gridTemplateColumns = `repeat(${boardWidth}, 100px)`;
    const gridTemplateRows = `repeat(${boardHeight}, 100px)`;

    const gameContext = useContext(GameContext);

    const emptyPieces = [];
    for(let i = 0; i < boardWidth; i++) {
        for(let j = 0; j < boardHeight; j++) {
            emptyPieces.push(<EmptyPiece key={`${i}-${j}`} x={i} y={j} />);
        }
    }

    return (
        <div className={styles["board"]} style={{gridTemplateColumns: gridTemplateColumns, gridTemplateRows: gridTemplateRows}}>
           {
            emptyPieces.map((emptyPiece) => {
                if(gameContext.state.placedPieces.some((piece: PieceType) => piece.positionX === emptyPiece.props.x && piece.positionY === emptyPiece.props.y)) {
                    return gameContext.state.placedPieces.filter((piece: PieceType) => piece.positionX === emptyPiece.props.x && piece.positionY === emptyPiece.props.y).map((piece: PieceType) => {
                        return <Piece key={piece.id} piece={piece} />
                    })
                }else{
                    return emptyPiece;
                }
            })
           }
        </div>
    );
};

export default Board;