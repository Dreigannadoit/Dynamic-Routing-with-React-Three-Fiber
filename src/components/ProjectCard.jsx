import React from 'react'
import { Link } from 'react-router-dom'
import { heart, sound } from '../assets'

const ProjectCard = ({ mob, onPlaySound }) => {
    const getTypeColor = (type) => {
        const colors = {
            'Passive': '#55FF55',
            'Neutral': '#FFAA00', 
            'Hostile': '#FF5555',
            'Boss': '#AA00AA',
            'Utility': '#5555FF'
        }
        return colors[type] || '#727272'
    }

    const handleSoundClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        onPlaySound(mob.id)
    }

    return (
        <div className="project-card" style={{ borderColor: getTypeColor(mob.type) }}>
            <div className="card-top-border" style={{ backgroundColor: getTypeColor(mob.type) }}></div>
            
            <Link to={`/mob/${mob.id}`} className="card-link">
                <div className="mob-image-popout">
                    <div className="popout-frame">
                        <div className="popout-inner">
                            <img src={mob.image} alt={mob.name} className="mob-image" />
                        </div>
                        <div className="popout-shadow"></div>
                    </div>
                    <div className="health-bar">
                        <div 
                            className="health-fill" 
                            style={{ 
                                width: `${Math.min(mob.health, 100)}%`,
                                backgroundColor: mob.health > 50 ? '#55FF55' : '#FF5555'
                            }}
                        ></div>
                        <span className="health-text">
                            <img src={heart} alt="❤️" className="heart-icon" /> 
                            {mob.health} HP
                        </span>
                    </div>
                </div>
                
                <div className="card-header">
                    <div 
                        className="mob-type-label"
                        style={{ 
                            backgroundColor: getTypeColor(mob.type),
                            borderColor: getTypeColor(mob.type)
                        }}
                    >
                        {mob.type}
                    </div>
                    <div className="mob-rarity-label">
                        {mob.rarity}
                    </div>
                </div>
                
                <div className="card-content">
                    <h3 className="mob-name">{mob.name}</h3>
                    <p className="mob-description">{mob.description.substring(0, 80)}...</p>

                    <div className="mob-stats">
                        <div className="stat-item">
                            <span className="stat-icon">Damage: </span>
                            <span className="stat-value">{mob.damage}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-icon">BIOM:</span>
                            <span className="stat-value">{mob.habitat}</span>
                        </div>
                    </div>
                </div>

                <div className="card-actions">
                    <button
                        onClick={handleSoundClick}
                        className={`sound-btn ${mob.isPlayingSound ? 'playing' : ''}`}
                        disabled={mob.isPlayingSound}
                    >
                        <img src={sound} alt="🔊" className="sound-icon" />
                    </button>
                    
                    <div 
                        className="view-mob-btn"
                        style={{ 
                            backgroundColor: getTypeColor(mob.type),
                            borderColor: getTypeColor(mob.type)
                        }}
                    >
                        View in 3D →
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProjectCard