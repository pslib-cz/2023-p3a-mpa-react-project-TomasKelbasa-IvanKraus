import React, { useContext } from 'react';
import { TileType } from '../../data/tile_type';
import styles from './Piece.module.scss';
import { GameContext } from '../providers/GameProvider';
import { ConnectDragSource, useDrag } from 'react-dnd';
import { DndTypes } from './EmptyPiece';

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

    const gameContext = useContext(GameContext);

    if(gameContext && gameContext.state.currentPiece && gameContext.state.currentPiece.id === piece.id){
        console.log("Current piece");

        const [collected, drag, dragPreview] = useDrag(() => ({
            type: DndTypes.PIECE,
            item: {piece: piece},
        }));
        return (
            <div ref={drag} className={styles["piece"]} style={{gridColumn: gridColumn, gridRow: gridRow}}>
                <img
                    src={`${defaultPathToImage}${piece.tile.imgname}`}
                    style={{transform: transform}}
                    />
            </div>
        );
    }else{
        return (
            <div className={styles["piece"]} style={{gridColumn: gridColumn, gridRow: gridRow}}>
                <img
                    src={`${defaultPathToImage}${piece.tile.imgname}`}
                    style={{transform: transform}}
                    />
            </div>
        );
    }

    
};

export default Piece;