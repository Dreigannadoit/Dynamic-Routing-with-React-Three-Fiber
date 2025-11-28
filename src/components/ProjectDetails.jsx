import React from 'react'
import { Link } from 'react-router-dom'
import { heart, sound } from '../assets'

const ProjectDetails = ({ mob, onPlaySound }) => {
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

    return (
        <div className="project-details-overlay">
            <div className="floating-block back-block">
                <Link to="/" className="back-link minecraft-btn">
                    ← Back to Mobs
                </Link>
            </div>

            <div className="floating-block header-block">
                <div className="mob-header">
                    <h1 className="mob-title">{mob.name}</h1>
                    <div className="type-tags">
                        <span 
                            className="type-tag"
                            style={{ 
                                backgroundColor: getTypeColor(mob.type),
                                borderColor: getTypeColor(mob.type)
                            }}
                        >
                            {mob.type}
                        </span>
                        <span className="rarity-tag">{mob.rarity}</span>
                    </div>
                </div>
            </div>

            <div className="floating-block sound-block">
                <button
                    onClick={() => onPlaySound(mob.id)}
                    className={`sound-btn large mob_dit ${mob.isPlayingSound ? 'playing' : ''}`}
                    disabled={mob.isPlayingSound}
                >
                    <img src={sound} alt="🔊" className="sound-icon mob_dit" />
                </button>
            </div>

            <div className="floating-block stats-block">
                <div className="block-header">
                    <h3>Stats</h3>
                </div>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-label">Health:</span>
                        <span className="stat-value">
                            <img src={heart} alt="Health" className="stat-icon heart-icon" />
                            {mob.health}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Damage:</span>
                        <span className="stat-value">{mob.damage}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Behavior:</span>
                        <span className="stat-value">{mob.behavior}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Habitat:</span>
                        <span className="stat-value">{mob.habitat}</span>
                    </div>
                </div>
            </div>

            <div className="floating-block description-block">
                <div className="block-header">
                    <h3>Description</h3>
                </div>
                <p className="description-text">{mob.description}</p>
            </div>

            <div className="floating-block drops-block">
                <div className="block-header">
                    <h3>Drops</h3>
                </div>
                <div className="drops-list">
                    {mob.drops.map((drop, index) => (
                        <span key={index} className="drop-item">
                            {drop}
                        </span>
                    ))}
                </div>
            </div>

            <div className="floating-block abilities-block">
                <div className="block-header">
                    <h3>Abilities & Weaknesses</h3>
                </div>
                <div className="abilities-content">
                    <div className="abilities-section">
                        <h4>Abilities</h4>
                        <ul>
                            {mob.abilities.map((ability, index) => (
                                <li key={index}>{ability}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="weaknesses-section">
                        <h4>Weaknesses</h4>
                        <ul>
                            {mob.weaknesses.map((weakness, index) => (
                                <li key={index}>{weakness}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails