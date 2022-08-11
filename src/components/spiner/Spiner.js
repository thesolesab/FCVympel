import React from 'react';
import './spiner.scss'

const Spiner = () => {
    return (
        <div className="loader-wrapper">
            <div className="loader">
                <div className="loader loader-inner"></div>
            </div>
        </div >
    );
};

export default Spiner;