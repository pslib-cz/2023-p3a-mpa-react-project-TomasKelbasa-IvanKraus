import React from 'react';
import { TileType } from '../../data/tile_type';

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

/*
*  all rotations must be done using this function!
*  rotation = angle in pi/2 radians from 1 to 3
*/
export const rotatePiece = (piece: PieceType, rotation: number): PieceType => {
    if(rotation < 1 || rotation > 3) throw new Error("Rotation must be between 1 and 3");
    return {
        ...piece,
        rotation: (piece.rotation + rotation) % 4,
        tile: {
            ...piece.tile,
            fields: piece.tile.fields.map(field => {
                return ({
                    sides: field.sides.map(f => {
                        f[0] = (f[0] + rotation - 1) % 4 + 1;
                        return f;
                    })
                    
                })
            }),
            roads: piece.tile.roads.map(road => {
                return {
                    sides: road.sides.map(num => {
                        return (num + rotation - 1) % 4 + 1;
                    })
                } 
            }),
            towns: piece.tile.towns.map(town => {
                return {
                    ...town,
                    sides: town.sides.map(num => {
                        return (num + rotation - 1) % 4 + 1;
                    })
                } 
            })

        }
    };
}

const Piece: React.FC<PieceProps> = ({piece}) => {
    
    const defaultPathToImage = "/src/images/";

    const transform = `rotate(${piece.rotation * 90}deg)`;

    return (
        <div>
            <img
                src={`${defaultPathToImage}${piece.tile.imgname}`}
                style={{transform: transform}}
                />
        </div>
    );
};

export default Piece;