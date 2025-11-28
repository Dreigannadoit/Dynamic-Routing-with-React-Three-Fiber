// src/pages/Home.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'

const Home = ({ mobs, onPlaySound }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    
    // Get last 5 mobs for the slider
    const sliderMobs = mobs.slice(-5)
    
    // Color mapping for mob types
    const getTypeColor = (type) => {
        const colors = {
            'Passive': '#55FF55', // Green
            'Neutral': '#FFAA00', // Orange
            'Hostile': '#FF5555', // Red
            'Boss': '#AA00AA',    // Purple
            'Utility': '#5555FF'  // Blue
        }
        return colors[type] || '#727272' // Default gray
    }

    useEffect(() => {
        if (sliderMobs.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % sliderMobs.length)
            }, 5000)
            
            return () => clearInterval(timer)
        }
    }, [sliderMobs.length])

    const goToSlide = (index) => {
        setCurrentSlide(index)
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sliderMobs.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sliderMobs.length) % sliderMobs.length)
    }

    return (
        <div className="home-page">
            <div className="hero">
                {sliderMobs.length > 0 ? (
                    <div className="slider-container">
                        <div className="slides">
                            {sliderMobs.map((mob, index) => (
                                <div
                                    key={mob.id}
                                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                                    style={{
                                        backgroundImage: `url(${mob.banner})`,
                                    }}
                                >
                                    <div className="slide-overlay">
                                        <div className="slide-content">
                                            <div 
                                                className="mob-type"
                                                style={{
                                                    backgroundColor: getTypeColor(mob.type),
                                                    borderColor: getTypeColor(mob.type)
                                                }}
                                            >
                                                {mob.type}
                                            </div>
                                            <h2 className="mob-name">{mob.name}</h2>
                                            <p className="mob-description">
                                                {mob.description.substring(0, 100)}...
                                            </p>
                                            <Link 
                                                to={`/mob/${mob.id}`} 
                                                className="minecraft-button"
                                            >
                                                View Mob
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation */}
                        {sliderMobs.length > 1 && (
                            <>
                                <button className="nav-button prev-button" onClick={prevSlide}>
                                    ‹
                                </button>
                                <button className="nav-button next-button" onClick={nextSlide}>
                                    ›
                                </button>
                                
                                <div className="pagination">
                                    {sliderMobs.map((mob, index) => (
                                        <button
                                            key={index}
                                            className={`pagination-dot ${index === currentSlide ? 'active' : ''}`}
                                            onClick={() => goToSlide(index)}
                                            style={{
                                                backgroundColor: index === currentSlide ? getTypeColor(mob.type) : '#555',
                                                borderColor: index === currentSlide ? getTypeColor(mob.type) : '#777'
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="hero-default">
                        <div className="hero-content">
                            <h1>Minecraft Mobs</h1>
                            <p>Explore the creatures of Minecraft</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="home-container">
                <div className="section-header">
                    <h2>Mob Library</h2>
                    <p>Click to explore in 3D</p>
                </div>

                <div className="mobs-grid" id='mob-list'>
                    {mobs.map(mob => (
                        <ProjectCard
                            key={mob.id}
                            mob={mob}
                            onPlaySound={onPlaySound}
                        />
                    ))}
                </div>

                {mobs.length === 0 && (
                    <div className="no-mobs">
                        <h3>No mobs available</h3>
                        <p>Check back later for more mobs!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home