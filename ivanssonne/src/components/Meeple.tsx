import React from 'react';
import { MeepleType } from '../providers/GameProvider';
import styles from './styles/Meeple.module.scss';
import black_meeple from '../assets/black_meeple.png';

interface MeepleProps {
    meeple: MeepleType
}

const Meeple: React.FC<MeepleProps> = ({meeple}) => {
    // Add your component logic here

    let className = styles["meeple"];

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
    return (
        <img src={black_meeple} alt="meeple" className={className}/>
    );
};

export default Meeple;