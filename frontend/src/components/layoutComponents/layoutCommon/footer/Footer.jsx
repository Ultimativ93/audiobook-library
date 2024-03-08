import React from 'react';
import { useLocation } from 'react-router-dom';

import './footer.css';

const Footer = () => {
    const location = useLocation();
    console.log("Location header", location);

    return (
        !location.pathname.includes("/editor") && (
            <div className='footer-container'>
                <div className='footer-content'>
                    <div className='footer-section'>
                        <h4>About Us</h4>
                        <ul>
                            <li>Company</li>
                            <li>Team</li>
                            <li>Careers</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                    <div className='footer-section'>
                        <h4>Services</h4>
                        <ul>
                            <li>Service 1</li>
                            <li>Service 2</li>
                        </ul>
                    </div>
                    <div className='footer-section'>
                        <h4>Resources</h4>
                        <ul>
                            <li>Resource 1</li>
                            <li>Resource 2</li>
                            <li>Resource 3</li>
                            <li>Resource 4</li>
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
