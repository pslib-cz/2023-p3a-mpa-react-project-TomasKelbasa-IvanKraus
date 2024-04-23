import React, { useContext, useEffect, useState } from 'react';
import { TileType } from '../../data/tile_type';
import styles from './styles/Piece.module.scss';
import { GameContext, GameActionTypes, getInfoOfRoadOrTown, isFieldEmpty } from '../providers/GameProvider';
import { useDrag } from 'react-dnd';
import { DndTypes } from './EmptyPiece';
import MeeplePlace from './MeeplePlace';
import Meeple from './Meeple';
import { endOfTurn } from './Game';

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


const Piece: React.FC<PieceProps> = React.memo(({ piece }) => {
    
    const defaultPathToImage = "/src/images/";

    const transform = `rotate(${piece.rotation * 90}deg)`;
    const gridColumn = `${piece.positionX}`;
    const gridRow = `${piece.positionY}`;

    const gameContext = useContext(GameContext);

    const [shouldEndTurn, setShouldEndTurn] = useState(false);

    const handlePlaceMeeple = (pos: number[]) => {
        gameContext.dispatch({type: GameActionTypes.PLACE_MEEPLE, position: pos});
        setShouldEndTurn(true);
    }

    // please dont judge me for this -
    // to je fakt ******* :D - Ivan
    useEffect(() => {
        if (shouldEndTurn) {
            endOfTurn(gameContext);
            setShouldEndTurn(false);
        }
    }, [shouldEndTurn, gameContext]);


    // if the piece is the current piece, we want to be able to drag it
    if(gameContext && gameContext.state.currentPiece && gameContext.state.currentPiece.id === piece.id){

        const [,drag] = useDrag(() => ({
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
    }
    else{

        const meeplePlaces: JSX.Element[] = []

        // monastery
        if(piece.tile.monastery){
            meeplePlaces.push(<MeeplePlace position={[5]} onClickHandler={() => handlePlaceMeeple([5])} />);
        }
        // towns
        meeplePlaces.push(...piece.tile.towns.flatMap((town) => {
            if(getInfoOfRoadOrTown(piece, town.sides, gameContext.state, "T").meeples.length === 0){
                return town.sides.map((side) => <MeeplePlace position={[side]} onClickHandler={() => handlePlaceMeeple([side])} />);  
            }
            else{
                return [];
            }
                    
        }));

        // roads
        meeplePlaces.push(...piece.tile.roads.flatMap((road) => {
            if(getInfoOfRoadOrTown(piece, [road.sides[0]], gameContext.state, "R").meeples.length === 0){
                return road.sides.map((side) => <MeeplePlace position={[side]} onClickHandler={() => handlePlaceMeeple([side])} />);  
            }
            else{
                return [];
            }
                    
        }));

        // fields :-(
        meeplePlaces.push(...piece.tile.fields.flatMap((field) => {
            if(isFieldEmpty(piece, field.sides[0], gameContext.state)){
                return <MeeplePlace position={field.sides[0]} onClickHandler={() => handlePlaceMeeple(field.sides[0])} />;
            }else{
                return [];
            }
        }));


        // list of meeple components for this piece
        const meeples: JSX.Element[] = gameContext.state.meeples
        .filter((meeple) => meeple.positionX === piece.positionX && meeple.positionY === piece.positionY)
        .map((meeple) => <Meeple meeple={meeple} />);


        return (
            <div className={styles["piece"]} style={{gridColumn: gridColumn, gridRow: gridRow}}>
                {
                    (gameContext.state.currentlyPlacedPieceId === piece.id)
                    ?
                    meeplePlaces
                    :
                    null
                }
                {
                    meeples
                }
                <img
                    className={styles["piece__img"]}
                    src={`${defaultPathToImage}${piece.tile.imgname}`}
                    loading="lazy"
                    style={{ transform: transform }}
                    alt="Game Piece"
                />
            </div>
        );
    }

    
});

export default Piece;