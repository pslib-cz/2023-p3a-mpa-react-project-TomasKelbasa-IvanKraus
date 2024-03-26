import React, { FormEvent, useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import { GameActionTypes, MeepleColors, SettingsType, TypeOfGame } from '../providers/GameProvider';
import { GameContext } from '../providers/GameProvider';

const HomeScreen: React.FC = () => {

    const gameContext = useContext(GameContext);

    const handleSettingsSubmit = (e: FormEvent) => {
        e.preventDefault();

        console.log("first dropdown: " + firstColor)
        console.log("second dropdown: " + secondColor)

        let fC = firstColor as MeepleColors;
        let sC = secondColor as MeepleColors;

        gameContext.dispatch({type: GameActionTypes.CHANGE_SETTINGS, newSettings: {
            firstColor: fC,
            secondColor: sC,
            firstName: firstName.current.value,
            secondName: secondName.current.value,
            typeOfGame: TypeOfGame.PVP
        }})



    }

    const firstName = useRef<HTMLInputElement>(null);
    const secondName = useRef<HTMLInputElement>(null);

    const [firstColor, setFirstColor] = useState<string>();
    const [secondColor, setSecondColor] = useState<string>();

    let firstDropdownOptions = ["BLACK", "BLUE", "GREEN", "RED", "YELLOW"].filter(col => col !== secondColor);
    let secondDropdownOptions = ["BLACK", "BLUE", "GREEN", "RED", "YELLOW"].filter(col => col !== firstColor);

    return (
        <div>
            <h1>Reactssonne</h1>
            <form onSubmit={(e) => handleSettingsSubmit(e)}>
                <h2>Settings</h2>
                <div>
                    <p>Player 1</p>
                    <label htmlFor='FirstName'>Name:</label>
                    <input ref={firstName} id='FirstName' type='text' required />
                    <Dropdown options={firstDropdownOptions} onChange={(opt) => setFirstColor(opt.value)} />
                </div>
                <div>
                    <p>Player 2</p>
                    <label htmlFor='SecondName'>Name:</label>
                    <input ref={secondName} id='SecondName' type='text' required />
                    <Dropdown options={secondDropdownOptions} onChange={(opt) => setSecondColor(opt.value)} />
                </div>
                <button type='submit'>Confirm</button>
            </form>
            <Link to="/game">Start Game</Link>
            <Link to="/about">About</Link>
        </div>
    );
};

export default HomeScreen;