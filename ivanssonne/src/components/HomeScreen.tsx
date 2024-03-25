import React from 'react';
import { Link } from 'react-router-dom';

const HomeScreen: React.FC = () => {
    return (
        <div>
            <h1>Reactssonne</h1>
            <Link to="/game">Start Game</Link>
            <Link to="/about">About</Link>
        </div>
    );
};

export default HomeScreen;