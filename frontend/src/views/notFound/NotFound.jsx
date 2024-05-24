import React from 'react'

import "./not-found.css";

const NotFound = () => {
    return (
        <div className='not-found-wrapper'>
            <img className='not-found-background-img' src={process.env.PUBLIC_URL + '/graphics/Earcade-Background.svg'} />
        </div>
    )
}

export default NotFound