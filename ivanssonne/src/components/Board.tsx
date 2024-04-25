import React, { useContext, useRef, useState, useEffect, useMemo } from 'react';
import styles from './styles/Board.module.scss';
import { GameContext } from '../providers/GameProvider';
import EmptyPiece from './EmptyPiece';
import Piece, { PieceType } from './Piece';
import logo from '../assets/logo.svg';
import tile from '../assets/tile-color.png';

interface BoardProps {}

type OverlayImages = { [key: string]: string };

const lerp = (start: number, end: number, alpha: number) => (1 - alpha) * start + alpha * end;

const Board: React.FC<BoardProps> = () => {
    const boardWidth = 50;
    const boardHeight = 50;
    const gridTemplateColumns = `repeat(${boardWidth}, 100px)`;
    const gridTemplateRows = `repeat(${boardHeight}, 100px)`;

    const boardRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [overlayImages, setOverlayImages] = useState<OverlayImages>({});
    const [overlayImage, setOverlayImage] = useState('');

    const gameContext = useContext(GameContext);
    const currentPlayerColor = gameContext.state.players.find(player => player.id === gameContext.state.currentPlayerId)?.meepleColor || 'transparent';

    useEffect(() => {
        const colors = ['black', 'blue', 'green', 'red', 'yellow'];
        const images: { [key: string]: string } = {}; // Add index signature
        const promises = colors.map(color =>
            import(`../assets/overlay-${color}.png`)
            .then(image => { images[color] = image.default; })
            .catch(() => { images[color] = '../assets/overlay-black.png'; })
        );
        Promise.all(promises).then(() => setOverlayImages(images));
    }, []);

    useEffect(() => {
        setOverlayImage(overlayImages[currentPlayerColor.toLowerCase()] || '../assets/overlay-black.png');
    }, [currentPlayerColor, overlayImages]);

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
        if(boardRef && boardRef.current) boardRef.current.style.cursor = 'grabbing';
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
        if(boardRef && boardRef.current) boardRef.current.style.cursor = 'grab';
    };

    const emptyPieces = gameContext.state.possiblePiecePlacements.map(u => <EmptyPiece key={`${u[0]}-${u[1]}`} x={u[0]} y={u[1]}/>);


    const boardOverlay = useMemo(() => <div className={styles["board_overlay"]} style={{
        backgroundImage: `url(${overlayImage})`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    }} />, [overlayImage])

    console.log(gameContext.state.possiblePiecePlacements);

    return (
        <div className={styles.boardContainer} style={{ position: 'relative' }}>
            <div className={styles["trapezoid"]}>
                <img className={styles["logo"]} src={logo} alt="Logo" />
            </div>
            <div className={styles["line_horizontal_down"]}></div>
            <div className={styles["line_horizontal_up"]}></div>
            <div className={styles["line_vertical_left"]}></div>
            <div className={styles["line_vertical_right"]}></div>
            <div
                ref={boardRef}
                className={styles.board}
                style={{ gridTemplateColumns, gridTemplateRows, backgroundImage: `url(${tile})`}}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {...emptyPieces}
                {...gameContext.state.placedPieces.map((piece: PieceType) => (
                    <Piece key={piece.id} piece={piece} />
                ))}
            </div>
            {boardOverlay}
        </div>
    );
};

export default Board;
