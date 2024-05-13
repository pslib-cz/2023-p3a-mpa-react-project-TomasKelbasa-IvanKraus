import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { GameContext } from '../providers/GameProvider';
import styles from './styles/EmptyPiece.module.scss';
import { DndTypes, GameActionTypes } from '../providers/utilities';

type EmptyPieceProps = {
    x: number;
    y: number;
};

const EmptyPiece: React.FC<EmptyPieceProps> = ({ x, y }) => {
    const { state, dispatch } = useContext(GameContext);
    const backgroundColor = "green";

    const [, drop] = useDrop({
        accept: DndTypes.PIECE,
        drop: () => {
            dispatch({
                type: GameActionTypes.PLACE_PIECE,
                locationX: x,
                locationY: y
            });
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const handleClick = () => {
        if (state.currentPiece) {
            dispatch({
                type: GameActionTypes.PLACE_PIECE,
                locationX: x,
                locationY: y
            });
        }
    };

    return (
        <div
            ref={drop}
            id={`${x}-${y}`}
            className={styles["piece--empty"]}
            style={{
                gridColumn: x,
                gridRow: y,
                backgroundColor: state.currentPiece && !backgroundColor ? 'pointer' : backgroundColor,
                cursor: state.currentPiece ? 'pointer' : 'not-allowed'
            }}
            onClick={handleClick}
        />
    );
};

export default EmptyPiece;
