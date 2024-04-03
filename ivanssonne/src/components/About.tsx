import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
    return (
        <div>
            <embed src="https://www.mindok.cz/userfiles/files/pravidla/8595558301126_50.pdf" width="900" height="700" type="application/pdf"/>
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default About;