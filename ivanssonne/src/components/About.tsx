import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
    return (
        <div>
            <h1>About Carcassonne</h1>
            <p>
                Carcassonne is a tile-based board game where players take turns placing tiles to build a medieval landscape.
                The goal is to strategically place your tiles to earn points by completing cities, roads, and other features.
            </p>
            <p>
                To play Carcassonne, follow these steps:
            </p>
            <ol>
                <li>Start with the starting tile placed in the center of the table.</li>
                <li>On your turn, draw a tile from the stack and place it adjacent to an existing tile.</li>
                <li>You can then choose to place one of your meeples on the tile to claim a feature.</li>
                <li>Complete cities, roads, and other features to earn points.</li>
                <li>Score points for completed features at the end of the game.</li>
                <li>The game ends when all tiles have been placed.</li>
                <li>The player with the most points wins!</li>
            </ol>
            <p>
                Have fun playing Carcassonne!
            </p>
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default About;