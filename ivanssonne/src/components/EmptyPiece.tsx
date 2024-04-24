import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { GameActionTypes, GameContext } from '../providers/GameProvider';
import styles from './styles/EmptyPiece.module.scss';

type EmptyPieceProps = {
    x: number;
    y: number;
};

export enum DndTypes {
    PIECE = "piece"
}


const EmptyPiece: React.FC<EmptyPieceProps> = ({ x, y }) => {

    const backgroundColor = "green";
    const gameContext = useContext(GameContext);

    const [, drop] = useDrop({
        accept: DndTypes.PIECE,
        drop: () => {
            gameContext.dispatch({type: GameActionTypes.PLACE_PIECE, locationX: x, locationY: y});
        }
    });

    return <div id={`${x} - ${y}`} ref={drop} className={styles["piece--empty"]} style={{ gridColumn: x, gridRow: y, backgroundColor: backgroundColor }} />
};

export default EmptyPiece;
