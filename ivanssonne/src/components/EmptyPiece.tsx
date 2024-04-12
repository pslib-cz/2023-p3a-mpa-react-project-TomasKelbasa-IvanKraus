import React, { useContext, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { GameActionTypes, GameContext } from '../providers/GameProvider';
import { PieceType } from './Piece';
import styles from './styles/EmptyPiece.module.scss';

type EmptyPieceProps = {
    x: number;
    y: number;
};

export enum DndTypes {
    PIECE = "piece"
}

const getBackgroundColor = (x: number, y: number, possiblePlacements: number[][]) => {
    const beige = "#F0D9B5";
    const darkbeige = "#B58863";
    let backgroundColor = (x + y) % 2 === 0 ? beige : darkbeige;
    if (possiblePlacements.some((placement) => placement[0] === x && placement[1] === y)) {
        backgroundColor = "green";
    }
    return backgroundColor;
};

const EmptyPiece: React.FC<EmptyPieceProps> = React.memo(({ x, y }) => {
    const gameContext = useContext(GameContext);
    const backgroundColor = useMemo(() => getBackgroundColor(x, y, gameContext.state.possiblePiecePlacements), [x, y, gameContext.state.possiblePiecePlacements]);

    const [, drop] = useDrop({
        accept: DndTypes.PIECE,
        drop: (item: PieceType) => {
            gameContext.dispatch({type: GameActionTypes.PLACE_PIECE, locationX: x, locationY: y});
        }
    });

    return (
        <div ref={drop} className={styles["piece--empty"]} style={{ gridColumn: x, gridRow: y, backgroundColor: backgroundColor }} />
    );
});

export default EmptyPiece;
