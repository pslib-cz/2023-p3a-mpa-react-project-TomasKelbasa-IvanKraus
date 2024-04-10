import React, { FormEvent, useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import { SettingsContext, MeepleColors, SettingsActionTypes, TypeOfGame } from '../providers/SettingsProvider';
import logo from '../assets/logo.png';
import styles from './styles/HomeScreen.module.scss';
import './styles/fonts.css';

const HomeScreen: React.FC = () => {

    const settingsContext = useContext(SettingsContext);

    const handleSettingsSubmit = (e: FormEvent) => {
        e.preventDefault();

        console.log("first dropdown: " + firstColor)
        console.log("second dropdown: " + secondColor)

        const fC = firstColor as MeepleColors;
        const sC = secondColor as MeepleColors;

        settingsContext.dispatch({type: SettingsActionTypes.SET_FIRST_NAME, payload: firstName.current?.value ?? "Player1"});
        settingsContext.dispatch({type: SettingsActionTypes.SET_SECOND_NAME, payload: secondName.current?.value ?? "Player2"});
        settingsContext.dispatch({type: SettingsActionTypes.SET_FIRST_COLOR, payload: fC});
        settingsContext.dispatch({type: SettingsActionTypes.SET_SECOND_COLOR, payload: sC});
        settingsContext.dispatch({type: SettingsActionTypes.SET_TYPE_OF_GAME, payload: TypeOfGame.PVP});

        alert("Settings succesfully updated")

    }

    const firstName = useRef<HTMLInputElement>(null);
    const secondName = useRef<HTMLInputElement>(null);

    const [firstColor, setFirstColor] = useState<string>();
    const [secondColor, setSecondColor] = useState<string>();

    let firstDropdownOptions = ["BLACK", "BLUE", "GREEN", "RED", "YELLOW"].filter(col => col !== secondColor);
    let secondDropdownOptions = ["BLACK", "BLUE", "GREEN", "RED", "YELLOW"].filter(col => col !== firstColor);

    return (
        /*
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
        */

        <div className={styles["homepage"]}>
            <img src={logo} alt="logo"/>
            
            <div className={styles["homepage__login"]}>
                <h2>Settings</h2>
                <form onSubmit={(e) => handleSettingsSubmit(e)}>
                    <div>
                        <p>Hráč 1:</p>
                        <div>
                            <label htmlFor='FirstName'>Jméno:</label>
                            <input ref={firstName} id='FirstName' type='text' required />
                            <Dropdown options={firstDropdownOptions} onChange={(opt) => setFirstColor(opt.value)} />
                        </div>
                    </div>
                    <div>
                        <p>Hráč 2:</p>
                        <div>
                            <label htmlFor='SecondName'>Jméno:</label>
                            <input ref={secondName} id='SecondName' type='text' required />
                            <Dropdown options={secondDropdownOptions} onChange={(opt) => setSecondColor(opt.value)} />
                        </div>
                    </div>
                    <button type='submit'>Potvrdit</button>
                </form>
            </div>
        </div>
    );
};

export default HomeScreen;