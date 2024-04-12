import React, { useContext, useRef, useState } from 'react';
import styles from './styles/Board.module.scss';
import { tileTypes } from '../../data/tile_type';
import Piece, { PieceType } from './Piece';
import { GameContext } from '../providers/GameProvider';
import EmptyPiece from './EmptyPiece';

interface BoardProps {
}

const Board: React.FC<BoardProps> = () => {
    const boardWidth = 50;
    const boardHeight = 50;

    // Pro vytvoření grid layoutu pro herní plochu
    const gridTemplateColumns = `repeat(${boardWidth}, 100px)`;
    const gridTemplateRows = `repeat(${boardHeight}, 100px)`;

    // Reference a stavy pro implementaci drag and drop
    const boardRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    const gameContext = useContext(GameContext);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (boardRef.current) {
            setIsDragging(true);
            setStartX(e.pageX);
            setStartY(e.pageY);
            boardRef.current.style.cursor = 'grabbing';
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && boardRef.current) {
            requestAnimationFrame(() => {
                const dx = e.pageX - startX;
                const dy = e.pageY - startY;
                boardRef.current.scrollLeft -= dx;
                boardRef.current.scrollTop -= dy;
                setStartX(e.pageX);
                setStartY(e.pageY);
            });
        }
    };
    
    const handleMouseUp = () => {
        if (boardRef.current) {
            setIsDragging(false);
            boardRef.current.style.cursor = 'grab';
        }
    };

    // Generování prázdných políček pro board
    const emptyPieces = [];
    for (let i = 0; i < boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            emptyPieces.push(<EmptyPiece key={`${i}-${j}`} x={i} y={j} />);
        }
    }

    return (
        <div
            ref={boardRef}
            className={styles["board"]}
            style={{ gridTemplateColumns: gridTemplateColumns, gridTemplateRows: gridTemplateRows }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
           {emptyPieces.map((emptyPiece) => {
               return gameContext.state.placedPieces.some((piece: PieceType) => piece.positionX === emptyPiece.props.x && piece.positionY === emptyPiece.props.y) ?
               gameContext.state.placedPieces.filter((piece: PieceType) => piece.positionX === emptyPiece.props.x && piece.positionY === emptyPiece.props.y).map((piece: PieceType) => <Piece key={piece.id} piece={piece} />) :
               emptyPiece;
           })}
        </div>
    );
};

export default Board;
