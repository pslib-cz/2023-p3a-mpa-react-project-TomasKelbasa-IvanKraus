import React, { useContext } from 'react';
import { MeepleType, GameContext } from '../providers/GameProvider';
import styles from './styles/Meeple.module.scss';
import { meeples } from '../assets/meeples.tsx';

interface MeepleProps {
    meeple: MeepleType
}

type StandingType = "S" | "L";

const Meeple: React.FC<MeepleProps> = ({meeple}) => {

    const gameContext = useContext(GameContext);
    let className = styles["meeple"];

    const color = gameContext.state.players.find(player => player.id === meeple.playerId)?.meepleColor;
    const standingProperty: StandingType = meeple.positionInPiece.length === 1 ? "S" : "L";

    if(meeple.positionInPiece.length === 1){
        switch(meeple.positionInPiece[0]){
            case 1:
                className += " " + styles["meeple--bottom-center"];
                break;
            case 2:
                className += " " + styles["meeple--left-center"];
                break;
            case 3:
                className += " " + styles["meeple--top-center"];
                break;
            case 4:
                className += " " + styles["meeple--right-center"];
                break;
            case 5:
                className += " " + styles["meeple--center"];
                break;
            default:
                console.log("Invalid position")
                break;
        }
    }
    else{
        switch(JSON.stringify(meeple.positionInPiece)){
            case JSON.stringify([1,1]):
                className += " " + styles["meeple--bottom-right"];
                break;
            case JSON.stringify([1,2]):
                className += " " + styles["meeple--bottom-left"];
                break;
            case JSON.stringify([2,1]):
                className += " " + styles["meeple--left-bottom"];
                break;
            case JSON.stringify([2,2]):
                className += " " + styles["meeple--left-top"];
                break;
            case JSON.stringify([3,1]):
                className += " " + styles["meeple--top-left"];
                break;
            case JSON.stringify([3,2]):
                className += " " + styles["meeple--top-right"];
                break;
            case JSON.stringify([4,1]):
                className += " " + styles["meeple--right-top"];
                break;
            case JSON.stringify([4,2]):
                className += " " + styles["meeple--right-bottom"];
                break;
            
        }
    }

    let meeplePath;

    if(standingProperty === "S"){
        switch(color){
            case "BLACK":
                meeplePath = meeples.SBLACK;
                break;
            case "BLUE":
                meeplePath = meeples.SBLUE;
                break;
            case "GREEN":
                meeplePath = meeples.SGREEN;
                break;
            case "RED":
                meeplePath = meeples.SRED;
                break;
            case "YELLOW":
                meeplePath = meeples.SYELLOW;
                break;
            default:
                console.log("Invalid color");
                break;    
        }
    }
    else{
        switch(color){
            case "BLACK":
                meeplePath = meeples.LBLACK;
                break;
            case "BLUE":
                meeplePath = meeples.LBLUE;
                break;
            case "GREEN":
                meeplePath = meeples.LGREEN;
                break;
            case "RED":
                meeplePath = meeples.LRED;
                break;
            case "YELLOW":
                meeplePath = meeples.LYELLOW;
                break;
            default:
                console.log("Invalid color");
                break;    
        }
    }


    return (
        <img src={meeplePath} alt="meeple" className={className}/>
    );
};

export default Meeple;