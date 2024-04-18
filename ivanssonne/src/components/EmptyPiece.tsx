import React, { useContext, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { GameActionTypes, GameContext } from '../providers/GameProvider';
import { PieceType } from './Piece';
import styles from './styles/EmptyPiece.module.scss';

type EmptyPieceProps = {
    x: number;
    y: number;
    active: boolean;
};

export enum DndTypes {
    PIECE = "piece"
}

const getBackgroundColor = (x: number, y: number, active: boolean) => {
    const beige = "#F0D9B5";
    const darkbeige = "#B58863";
    let backgroundColor = (x + y) % 2 === 0 ? beige : darkbeige;
    if (active) {
        backgroundColor = "green";
    }
    return backgroundColor;
};

const EmptyPiece: React.FC<EmptyPieceProps> = React.memo(({ x, y, active }) => {

    const backgroundColor = useMemo(() => getBackgroundColor(x, y, active), [x, y, active]);
    const gameContext = useContext(GameContext);

    const [, drop] = useDrop({
        accept: DndTypes.PIECE,
        drop: (item: PieceType) => {
            gameContext.dispatch({type: GameActionTypes.PLACE_PIECE, locationX: x, locationY: y});
        }
    });

    if(active) return (
        <div id={`${x} - ${y}`} ref={drop} className={styles["piece--empty"]} style={{ gridColumn: x, gridRow: y, backgroundColor: backgroundColor }} />
    );

    else return (
        <div id={`${x} - ${y}`} className={styles["piece--empty"]} style={{ gridColumn: x, gridRow: y, backgroundColor: backgroundColor }} />
    );
});

export default EmptyPiece;
