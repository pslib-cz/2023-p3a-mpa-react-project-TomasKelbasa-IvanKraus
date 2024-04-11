import React from 'react';
import { Link } from 'react-router-dom';
import navod from '../assets/Reactssonne-navod-1.pdf';
import styles from './styles/About.module.scss';
import logo from '../assets/logo.png';

const About: React.FC = () => {
    return (
        <div className={styles["about"]}>
            <img src={logo} className={styles["about__logo"]} alt="logo"/>
            <embed src={navod} className={styles["about__pdf"]} width="1200" height="1080" type="application/pdf"/>
            <Link className={styles["button--back"]} to="/">Back to Home</Link>
        </div>
    );
};

export default About;