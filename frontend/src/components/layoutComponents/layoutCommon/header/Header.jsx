import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import './header.css';

const Header = () => {

    const location = useLocation();
    console.log("Logcation header", location)


    return (
        <div className='header-container'>
            {!location.pathname.includes("/editor") && (
                <div className='header-content'>
                    <p style={{color: 'white'}}>Hi</p>
                </div>
            )}
        </div>
    )
}

export default Header
