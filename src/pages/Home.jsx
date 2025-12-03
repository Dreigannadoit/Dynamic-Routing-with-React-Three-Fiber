import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'

const Home = ({ mobs, onPlaySound }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [selectedType, setSelectedType] = useState('All')
    const [filteredMobs, setFilteredMobs] = useState(mobs)
    const [showFilter, setShowFilter] = useState(false)
    const homeContainerRef = useRef(null)

    const sliderMobs = mobs.slice(-5)

    const mobTypes = ['All', ...new Set(mobs.map(mob => mob.type))]

    const getTypeColor = (type) => {
        const colors = {
            'Passive': '#55FF55',
            'Neutral': '#FFAA00',
            'Hostile': '#FF5555',
            'Boss': '#AA00AA',
            'Utility': '#5555FF',
            'All': '#727272'
        }
        return colors[type] || '#727272'
    }
    useEffect(() => {
        if (selectedType === 'All') {
            setFilteredMobs(mobs)
        } else {
            setFilteredMobs(mobs.filter(mob => mob.type === selectedType))
        }
    }, [selectedType, mobs])



    useEffect(() => {
        const handleScroll = () => {
            if (homeContainerRef.current) {
                const containerRect = homeContainerRef.current.getBoundingClientRect()
                setShowFilter(containerRect.top <= window.innerHeight * 0.8)
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])



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

            <br /><br /><br />
                <div className="section-header">
                    <h2>Mob Library</h2>
                    <p>Click to explore in 3D</p>
                    <div className="active-filter">
                        Showing: <span style={{ color: getTypeColor(selectedType) }}>{selectedType}</span>
                        ({filteredMobs.length} {filteredMobs.length === 1 ? 'mob' : 'mobs'})
                    </div>
                </div>

            <div className="home-container" ref={homeContainerRef}>

                {showFilter && (
                    <div className="filter-sidebar">
                        <div className="filter-header">
                            <h3>Filter Mobs</h3>
                        </div>
                        <div className="filter-options">
                            {mobTypes.map(type => (
                                <button
                                    key={type}
                                    className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                                    onClick={() => setSelectedType(type)}
                                    style={{
                                        backgroundColor: selectedType === type ? getTypeColor(type) : '#555',
                                        borderColor: getTypeColor(type)
                                    }}
                                >
                                    {type}
                                    {type !== 'All' && (
                                        <span className="mob-count">
                                            ({mobs.filter(mob => mob.type === type).length})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mobs-grid" id='mob-list'>
                    {filteredMobs.map(mob => (
                        <ProjectCard
                            key={mob.id}
                            mob={mob}
                            onPlaySound={onPlaySound}
                        />
                    ))}
                </div>

                {filteredMobs.length === 0 && (
                    <div className="no-mobs">
                        <h3>No mobs found</h3>
                        <p>Try selecting a different filter</p>
                        <button
                            className="minecraft-button"
                            onClick={() => setSelectedType('All')}
                        >
                            Show All Mobs
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home