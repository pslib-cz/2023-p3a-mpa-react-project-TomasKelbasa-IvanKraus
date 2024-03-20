import React from 'react';
import { TileType } from '../../data/tile_type';
import styles from './Piece.module.scss';

export interface PieceProps {
    piece: PieceType;
}

export type PieceType = {
    id: string;
    placed: boolean;
    // rotation in pi/2 radians, default = 0
    rotation: number;
    positionX: number;
    positionY: number;
    tile: TileType;
}


const Piece: React.FC<PieceProps> = ({piece}) => {
    
    const defaultPathToImage = "/src/images/";

    const transform = `rotate(${piece.rotation * 90}deg)`;
    const gridColumn = `${piece.positionX}`;
    const gridRow = `${piece.positionY}`;

    return (
        <div className={styles["piece"]} style={{gridColumn: gridColumn, gridRow: gridRow}}>
            <img
                src={`${defaultPathToImage}${piece.tile.imgname}`}
                style={{transform: transform}}
                />
        </div>
    );
};

export default Piece;