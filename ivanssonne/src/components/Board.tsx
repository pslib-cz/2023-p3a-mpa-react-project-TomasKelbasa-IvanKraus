import React, { useContext, useRef, useState, useEffect } from 'react';
import styles from './styles/Board.module.scss';
import { GameContext } from '../providers/GameProvider';
import EmptyPiece from './EmptyPiece';
import Piece, { PieceType } from './Piece';
import backgroundoverlay from '../assets/overlay-green.svg';


interface BoardProps {}

const lerp = (start, end, alpha) => (1 - alpha) * start + alpha * end;

const Board: React.FC<BoardProps> = () => {
    const boardWidth = 50;
    const boardHeight = 50;
    const gridTemplateColumns = `repeat(${boardWidth}, 100px)`;
    const gridTemplateRows = `repeat(${boardHeight}, 100px)`;

    const boardRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    const gameContext = useContext(GameContext);

    useEffect(() => {
        if (boardRef.current) {
            const { scrollWidth, clientWidth, scrollHeight, clientHeight } = boardRef.current;
            boardRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
            boardRef.current.scrollTop = (scrollHeight - clientHeight) / 2;
        }
    }, []); 

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX);
        setStartY(e.pageY);
        boardRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && boardRef.current) {
            const dx = e.pageX - startX;
            const dy = e.pageY - startY;
            boardRef.current.scrollLeft = lerp(boardRef.current.scrollLeft, boardRef.current.scrollLeft - dx, 0.6);
            boardRef.current.scrollTop = lerp(boardRef.current.scrollTop, boardRef.current.scrollTop - dy, 0.6);
            setStartX(e.pageX);
            setStartY(e.pageY);
        } else {
            setIsDragging(false); 
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        boardRef.current.style.cursor = 'grab';
    };

    const emptyPieces = [];
    for (let i = 0; i < boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            emptyPieces.push(<EmptyPiece key={`${i}-${j}`} x={i} y={j} />);
        }
    }

    return (
        <div
            ref={boardRef}
            className={styles.board}
            style={{ gridTemplateColumns, gridTemplateRows }}
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
