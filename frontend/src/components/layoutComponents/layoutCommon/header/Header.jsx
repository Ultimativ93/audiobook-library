import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import './header.css';

// "Header.jsx" component handle the menu bar for the navigation between the views. Is added on all views/sites.
const Header = () => {
    const location = useLocation();
    const [isEditorRoute, setIsEditorRoute] = useState();

    useEffect(() => {
        setIsEditorRoute(location.pathname.includes('/editor'));
    }, [location]);

    useEffect(() => {
        document.body.style.overflow = isEditorRoute ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isEditorRoute]);

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    return (
        <div className='header-container'>
                <div className='header-content'>

                    <Button className='logo-button-container' colorScheme='highlightColor' borderRadius={'2px'} size='sm'>
                        <Link to='/'>
                            <div>
                                <img src={process.env.PUBLIC_URL + '/graphics/Earcade-Logo.png'} alt='Earcade Logo' style={{ width: '100%', height: 'auto' }} />
                            </div>
                        </Link>
                    </Button>

                    <Link to='/'>
                        <Button className={isActiveRoute('/') ? 'active' : ''} colorScheme='transparent'>Home</Button>
                    </Link>

                    <Link to='/user-projects'>
                        <Button className={isActiveRoute('/user-projects') ? 'active' : ''} colorScheme='transparent'>Projects</Button>
                    </Link>

                    <Link to='/contact'>
                        <Button className={isActiveRoute('/contact') ? 'active' : ''} colorScheme='transparent'>Feedback</Button>
                    </Link>

                    <Link to='/team'>
                        <Button className={isActiveRoute('/team') ? 'active' : ''} colorScheme='transparent'>Team</Button>
                    </Link>

                    <Link className='header-tutorials' to='/tutorials'>
                        <Button className={isActiveRoute('/tutorials') ? 'active' : ''} colorScheme='transparent'>Tutorials</Button>
                    </Link>
                    
                </div>
        </div>
    );
};

export default Header;
