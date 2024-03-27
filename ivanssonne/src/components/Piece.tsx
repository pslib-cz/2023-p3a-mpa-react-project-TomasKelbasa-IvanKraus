import React, { useContext } from 'react';
import { TileType } from '../../data/tile_type';
import styles from './Piece.module.scss';
import { GameContext, GameActionTypes } from '../providers/GameProvider';
import { ConnectDragSource, useDrag } from 'react-dnd';
import { DndTypes } from './EmptyPiece';
import MeeplePlace from './MeeplePlace';
import Meeple from './Meeple';

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

    const handlePlaceMeeple = (pos: number[]) => {
        gameContext.dispatch({type: GameActionTypes.PLACE_MEEPLE, position: pos});
        gameContext.dispatch({type: GameActionTypes.END_TURN});
    }
    if(gameContext && gameContext.state.currentPiece && gameContext.state.currentPiece.id === piece.id){

        const [collected, drag, dragPreview] = useDrag(() => ({
            type: DndTypes.PIECE,
            item: {piece: piece},
        }));
        return (
            <div ref={drag} className={styles["piece"]} style={{}}>
                <img
                    className={styles["piece__img--unplaced"]}
                    src={`${defaultPathToImage}${piece.tile.imgname}`}
                    style={{transform: transform}}
                    />
            </div>
        );
    }else{

        let meeplePlaces: JSX.Element[] = []

        // monastery
        if(piece.tile.monastery){
            meeplePlaces.push(<MeeplePlace position={[5]} onClickHandler={() => handlePlaceMeeple([5])} />);
        }
        // towns
        meeplePlaces.push(...piece.tile.towns.flatMap((town) => {
            return town.sides.map((side) => <MeeplePlace position={[side]} onClickHandler={() => handlePlaceMeeple([side])} />);          
        }));
        // roads
        meeplePlaces.push(...piece.tile.roads.flatMap((road) => {
            return road.sides.map((side) => <MeeplePlace position={[side]} onClickHandler={() => handlePlaceMeeple([side])} />);          
        }));

        // fields :-(
        meeplePlaces.push(...piece.tile.fields.flatMap((field) => {
            return <MeeplePlace position={field.sides[0]} onClickHandler={() => handlePlaceMeeple(field.sides[0])} />;
        }));


        let meeples: JSX.Element[] = [];
        // meeples

        gameContext.state.meeples.forEach((meeple) => {
            if(meeple.positionX === piece.positionX && meeple.positionY === piece.positionY){
                meeples.push(<Meeple meeple={meeple} />);
            }
        })

        return (
            <div className={styles["piece"]} style={{gridColumn: gridColumn, gridRow: gridRow}}>
                {
                    (gameContext.state.currentlyPlacedPieceId === piece.id)
                    ?
                    meeplePlaces
                    :
                    null}
                    {
                        meeples
                    }
                <img
                    className={styles["piece__img"]}
                    src={`${defaultPathToImage}${piece.tile.imgname}`}
                    style={{transform: transform}}
                    />
            </div>
        );
    }

    
};

export default Piece;