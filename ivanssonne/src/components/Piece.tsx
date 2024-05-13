import React, { useContext, useEffect, useState } from 'react';
import { TileType } from '../data/tile_type.tsx';
import styles from './styles/Piece.module.scss';
import { GameContext } from '../providers/GameProvider';
import { useDrag } from 'react-dnd';
import MeeplePlace from './MeeplePlace';
import Meeple from './Meeple';
import { images } from '../images/index.tsx';
import { getInfoOfRoadOrTown, isFieldEmpty, DndTypes, endOfTurn, GameActionTypes } from '../providers/utilities.tsx';

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
    const [,drag] = useDrag(() => ({
        type: DndTypes.PIECE,
        item: {piece: piece},
    }));

    // if the piece is the current piece, we want to be able to drag it
    if(gameContext && gameContext.state.currentPiece && gameContext.state.currentPiece.id === piece.id){

        
        return (
            <div ref={drag} className={styles["piece"]} style={{}}>
                <img
                    className={styles["piece__img--unplaced"]}
                    src={images[piece.tile.imgname.charCodeAt(0) - 'A'.charCodeAt(0)]}
                    style={{transform: transform}}
                    />
            </div>
        );
    }
    else{

        const meeplePlaces: JSX.Element[] = []
        if(gameContext.state.currentlyPlacedPieceId === piece.id){
            // monastery
            if(piece.tile.monastery){
                meeplePlaces.push(<MeeplePlace key={Math.random()} position={[5]} onClickHandler={() => handlePlaceMeeple([5])} />);
            }
            // towns
            meeplePlaces.push(...piece.tile.towns.flatMap((town) => {
                if(getInfoOfRoadOrTown(piece, town.sides, gameContext.state, "T").meeples.length === 0){
                    return town.sides.map((side) => <MeeplePlace key={Math.random()} position={[side]} onClickHandler={() => handlePlaceMeeple([side])} />);  
                }
                else{
                    return [];
                }
                        
            }));

            // roads
            meeplePlaces.push(...piece.tile.roads.flatMap((road) => {
                if(getInfoOfRoadOrTown(piece, [road.sides[0]], gameContext.state, "R").meeples.length === 0){
                    return road.sides.map((side) => <MeeplePlace key={Math.random()} position={[side]} onClickHandler={() => handlePlaceMeeple([side])} />);  
                }
                else{
                    return [];
                }
                        
            }));

            // fields :-(
            meeplePlaces.push(...piece.tile.fields.flatMap((field) => {
                if(isFieldEmpty(piece, field.sides[0], gameContext.state)){
                    return <MeeplePlace key={Math.random()} position={field.sides[0]} onClickHandler={() => handlePlaceMeeple(field.sides[0])} />;
                }else{
                    return [];
                }
            }));
        }

        // list of meeple components for this piece
        const meeples: JSX.Element[] = gameContext.state.meeples
        .filter((meeple) => meeple.positionX === piece.positionX && meeple.positionY === piece.positionY)
        .map((meeple) => <Meeple meeple={meeple} />);

        return (
            <div className={styles["piece"]} style={{gridColumn: gridColumn, gridRow: gridRow}}>
                {
                    meeplePlaces
                }
                {
                    meeples
                }
                <img
                    className={styles["piece__img"]}
                    src={images[piece.tile.imgname.charCodeAt(0) - 'A'.charCodeAt(0)]}
                    loading="lazy"
                    style={{ transform: transform }}
                    alt="Game Piece"
                />
            </div>
        );
    }

    
});

export default Piece;