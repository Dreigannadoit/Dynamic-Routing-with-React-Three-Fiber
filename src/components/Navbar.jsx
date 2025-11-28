import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../assets'

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img src={Logo} alt="" />
                </Link>
                <ul className="nav-links">
                    <li>
                        <Link to="/#mob-list" className="nav-link">
                            All Mobs
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar