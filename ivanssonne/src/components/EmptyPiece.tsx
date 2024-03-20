import React from 'react';
import styles from './EmptyPiece.module.scss';

type EmptyPieceProps = {
    x: number;
    y: number;
};

const EmptyPiece: React.FC<EmptyPieceProps> = ({ x, y }) => {
    const gridColumn = `${x}`;
    const gridRow = `${y}`;

    const backgroundColor = (x + y) % 2 === 0 ? "white" : "grey";

    return (
        <div className={styles["piece--empty"]} style={{ gridColumn: gridColumn, gridRow: gridRow, backgroundColor: backgroundColor }}>

        </div>
    );
};

export default EmptyPiece;