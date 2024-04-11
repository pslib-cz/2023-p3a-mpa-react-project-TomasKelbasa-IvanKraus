import React, { FormEvent, useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import { SettingsContext, MeepleColors, SettingsActionTypes, TypeOfGame } from '../providers/SettingsProvider';
import logo from '../assets/logo.png';
import styles from './styles/HomeScreen.module.scss';
const ColorCircle = ({ color, onSelect, selected, selectable }) => {
    const circleStyle = {
        backgroundColor: color.toLowerCase(),
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        display: 'inline-block',
        margin: '5px',
        border: selected ? '2px solid beige' : '2px solid black',
        cursor: selectable ? 'pointer' : 'not-allowed',
        opacity: selectable ? 1 : 0.5,
    };
    
    const handleClick = () => {
        if (selectable) {
            onSelect(color);
        }
    };

    return <div style={circleStyle} onClick={handleClick} />;
};


const HomeScreen = () => {
    const settingsContext = useContext(SettingsContext);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const displaySuccessMessage = () => {
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000); 
    };

    const handleSettingsSubmit = (e) => {
        e.preventDefault();
        settingsContext.dispatch({type: SettingsActionTypes.SET_FIRST_NAME, payload: firstName.current?.value ?? "Hráč1"});
        settingsContext.dispatch({type: SettingsActionTypes.SET_SECOND_NAME, payload: secondName.current?.value ?? "Hráč2"});
        settingsContext.dispatch({type: SettingsActionTypes.SET_FIRST_COLOR, payload: firstColor});
        settingsContext.dispatch({type: SettingsActionTypes.SET_SECOND_COLOR, payload: secondColor});
        settingsContext.dispatch({type: SettingsActionTypes.SET_TYPE_OF_GAME, payload: TypeOfGame.PVP});

        displaySuccessMessage();
    };

    const firstName = useRef(null);
    const secondName = useRef(null);

    const [firstColor, setFirstColor] = useState('');
    const [secondColor, setSecondColor] = useState('');

    const colorOptions = ["BLACK", "BLUE", "GREEN", "RED", "YELLOW"];

    return (
        <div className={styles["homepage"]}>
            <img src={logo} alt="logo"/>
            <div className={styles["homepage__login"]}>
                <form onSubmit={handleSettingsSubmit}>
                    <div className={styles["user"]}>
                        <p>Hráč 1:</p>
                        <div>
                            <div className={styles["user__name"]}>
                                <label htmlFor='FirstName'>Jméno:</label>
                                <input ref={firstName} id='FirstName' type='text' required />
                            </div>
                            <div className={styles["user__color"]}>
                            <span>Barva:</span>
                                <div className={styles["bullets"]}>
                                    {colorOptions.map(color =>
                                        <ColorCircle
                                            key={color}
                                            color={color}
                                            onSelect={setFirstColor}
                                            selected={firstColor === color}
                                            selectable={secondColor !== color}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles["user"]}>
                        <p>Hráč 2:</p>
                        <div>
                            <div className={styles["user__name"]}>
                                <label htmlFor='SecondName'>Jméno:</label>
                                <input ref={secondName} id='SecondName' type='text' required />
                            </div>
                            <div className={styles["user__color"]}>
                                <span>Barva:</span>
                                <div className={styles["bullets"]}>
                                    {colorOptions.map(color =>
                                        <ColorCircle
                                            key={color}
                                            color={color}
                                            onSelect={setSecondColor}
                                            selected={secondColor === color}
                                            selectable={firstColor !== color}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className={styles["button--submit"]} type='submit'>Potvrdit</button>
                </form>
                {showSuccessMessage && (
                    <div className={styles["success_message"]}>Aktualizováno</div>
                )}
            </div>

            <div className={styles["homepage__menu"]}>
                <Link to="/game" className={styles["homepage__menu__item"]}>Nová hra</Link>
                <Link to="/about" className={styles["homepage__menu__item"]}>Návod</Link>
            </div>

            <div className={styles["homepage__footer"]}>
                <p>by K&K corporation ©</p>
            </div>
        </div>
    );
};

export default HomeScreen;
