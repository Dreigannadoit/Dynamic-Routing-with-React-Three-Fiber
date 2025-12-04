import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../assets'

const Navbar = () => {
    const scrollToMobs = () => {
        if (window.location.pathname === '/') {
            const mobsSection = document.getElementById('mob-list');
            if (mobsSection) {
                mobsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img src={Logo} alt="Minecraft Mobs" />
                </Link>
                <ul className="nav-links">
                    <li>
                        <Link
                            to="/"
                            className="nav-link"
                            onClick={(e) => {
                                if (window.location.pathname === '/') {
                                    e.preventDefault();
                                    scrollToMobs();
                                }
                            }}
                        >
                            All Mobs
                        </Link>

                        <Link to="/add-mob" className="nav-link add-mob-link">
                            + Add New Mob
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar