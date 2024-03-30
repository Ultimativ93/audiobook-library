import React from 'react';
import { useLocation, Link } from 'react-router-dom';

import './footer.css';

// "Footer.jsx" component handles the footer information. Is added on every page but the Editor.
const Footer = () => {
    const location = useLocation();

    return (
        !location.pathname.includes('/editor') && (
            <div className='footer-container'>
                <div className='footer-content'>
                    <div className='footer-section'>
                        <h4>About Us</h4>
                        <ul>
                            <Link to='/team'><li>Team</li></Link>
                            <li>Careers</li>
                            <Link to='/contact'><li>Contact Us</li></Link>
                        </ul>
                    </div>
                    <div className='footer-section'>
                        <h4>Services</h4>
                        <ul>
                            <Link to='/'><li>Interactive Audiobooks</li></Link>
                            <Link to='/user-projects'><li>Editor</li></Link>
                        </ul>
                    </div>
                    <div className='footer-section'>
                        <h4>Help</h4>
                        <ul>
                            <Link to='/tutorials'><li>Tutorials</li></Link>
                            <li>FAQ</li>
                        </ul>
                    </div>
                    <div className='footer-section'>
                        <h4>Legal</h4>
                        <ul>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Cookie Policy</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    );
}

export default Footer;
