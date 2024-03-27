import React, { useContext } from 'react';
import { TileType } from '../../data/tile_type';
import styles from './Piece.module.scss';
import { GameContext } from '../providers/GameProvider';
import { ConnectDragSource, useDrag } from 'react-dnd';
import { DndTypes } from './EmptyPiece';
import MeeplePlace from './MeeplePlace';

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

        const [collected, drag, dragPreview] = useDrag(() => ({
            type: DndTypes.PIECE,
            item: {piece: piece},
        }));
        return (
            <div ref={drag} className={styles["piece"]} style={{}}>
                <img
                    src={`${defaultPathToImage}${piece.tile.imgname}`}
                    style={{transform: transform}}
                    />
            </div>
        );
    }else{

        let meeplePlaces: JSX.Element[] = []

        // monastery
        if(piece.tile.monastery){
            meeplePlaces.push(<MeeplePlace position={[5]} onClickHandler={() => {}} />);
        }
        // towns
        meeplePlaces.push(...piece.tile.towns.flatMap((town) => {
            return town.sides.map((side) => <MeeplePlace position={[side]} onClickHandler={() => {}} />);          
        }));
        // roads
        meeplePlaces.push(...piece.tile.roads.flatMap((road) => {
            return road.sides.map((side) => <MeeplePlace position={[side]} onClickHandler={() => {}} />);          
        }));

        // fields :-(
        meeplePlaces.push(...piece.tile.fields.flatMap((field) => {
            return <MeeplePlace position={field.sides[0]} onClickHandler={() => {}} />;
        }));

        return (
            <div className={styles["piece"]} style={{gridColumn: gridColumn, gridRow: gridRow}}>
                {
                    (gameContext.state.currentlyPlacedPiece?.id === piece.id)
                    ?
                    meeplePlaces
                    :
                    null}
                <img
                    src={`${defaultPathToImage}${piece.tile.imgname}`}
                    style={{transform: transform}}
                    />
            </div>
        );
    }

    
};

export default Piece;