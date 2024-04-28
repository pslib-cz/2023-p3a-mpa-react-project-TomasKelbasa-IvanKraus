import React from 'react';
import styles from './styles/MeeplePlace.module.scss';

interface MeeplePlaceProps {
    position: number[];
    onClickHandler: () => void;
}

const MeeplePlace: React.FC<MeeplePlaceProps> = ({ position, onClickHandler }) => {

    let className = styles["meeple__place"];

    if(position.length === 1){
        switch(position[0]){
            case 1:
                className += " " + styles["meeple__place--bottom-center"];
                break;
            case 2:
                className += " " + styles["meeple__place--left-center"];
                break;
            case 3:
                className += " " + styles["meeple__place--top-center"];
                break;
            case 4:
                className += " " + styles["meeple__place--right-center"];
                break;
            case 5:
                className += " " + styles["meeple__place--center"];
                break;
            default:
                console.log("Invalid position")
                break;
        }
    }
    else{
        switch(JSON.stringify(position)){
            case JSON.stringify([1,1]):
                className += " " + styles["meeple__place--bottom-right"];
                break;
            case JSON.stringify([1,2]):
                className += " " + styles["meeple__place--bottom-left"];
                break;
            case JSON.stringify([2,1]):
                className += " " + styles["meeple__place--left-bottom"];
                break;
            case JSON.stringify([2,2]):
                className += " " + styles["meeple__place--left-top"];
                break;
            case JSON.stringify([3,1]):
                className += " " + styles["meeple__place--top-left"];
                break;
            case JSON.stringify([3,2]):
                className += " " + styles["meeple__place--top-right"];
                break;
            case JSON.stringify([4,1]):
                className += " " + styles["meeple__place--right-top"];
                break;
            case JSON.stringify([4,2]):
                className += " " + styles["meeple__place--right-bottom"];
                break;
            
        }
    }

    return (
        <button className={className} onClick={() => onClickHandler()}></button>
    );
};

export default MeeplePlace;