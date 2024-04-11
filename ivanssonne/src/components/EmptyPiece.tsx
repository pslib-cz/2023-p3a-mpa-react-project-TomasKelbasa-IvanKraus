import React, { useContext } from 'react';
import styles from './styles/EmptyPiece.module.scss';
import { useDrop } from 'react-dnd';
import { GameActionTypes, GameContext } from '../providers/GameProvider';
import { PieceType } from './Piece';

type EmptyPieceProps = {
    x: number;
    y: number;
};

export enum DndTypes {
    PIECE = "piece"
}

const EmptyPiece: React.FC<EmptyPieceProps> = ({ x, y }) => {
    const gridColumn = `${x}`;
    const gridRow = `${y}`;

    const beige = "#F0D9B5";
    const darkbeige = "#B58863";

    let backgroundColor = (x + y) % 2 === 0 ? beige : darkbeige;

    
    const gameContext = useContext(GameContext);

    const [collectedProps, drop] = useDrop({
        accept: DndTypes.PIECE,
        drop: (item: PieceType) => {
            gameContext.dispatch({type: GameActionTypes.PLACE_PIECE, locationX: x, locationY: y});
        }
    
    });

    if(gameContext.state.possiblePiecePlacements.some((placement) => placement[0] === x && placement[1] === y)) {
        backgroundColor = "green";
        return (
            <div ref={drop} className={styles["piece--empty"]} style={{ gridColumn: gridColumn, gridRow: gridRow, backgroundColor: backgroundColor }} >
            </div>
        );
    }else{
        return (
            <div className={styles["piece--empty"]} style={{ gridColumn: gridColumn, gridRow: gridRow, backgroundColor: backgroundColor }} >
            </div>
        );
    }
    
};

export default EmptyPiece;