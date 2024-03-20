import React from 'react';
import styles from './EmptyPiece.module.scss';
import { useDrop } from 'react-dnd';

type EmptyPieceProps = {
    x: number;
    y: number;
};

const EmptyPiece: React.FC<EmptyPieceProps> = ({ x, y }) => {
    const gridColumn = `${x}`;
    const gridRow = `${y}`;

    const backgroundColor = (x + y) % 2 === 0 ? "white" : "grey";

    if(true) {
    
        const drop = useDrop({
            accept: "piece",
            drop: (item: any) => {
                console.log(item);
            }
        
        })
    
    }

    return (
        <div className={styles["piece--empty"]} style={{ gridColumn: gridColumn, gridRow: gridRow, backgroundColor: backgroundColor }} />
    );
};

export default EmptyPiece;