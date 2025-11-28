import React, { useState, useEffect } from 'react'
import './Instructions.css'

const Instructions = () => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
    }

    if (!isVisible) {
        return (
            <div className="instructions-toggle" onClick={toggleVisibility}>
                <span>?</span>
            </div>
        )
    }

    return (
        <div className="instructions-container">
            <div className="instructions-content">
                <div className="instruction-item">
                    <span className="instruction-label">Orbit:</span>
                    <span className="instruction-description">Left mouse / touch: one-finger move</span>
                </div>
                <div className="instruction-item">
                    <span className="instruction-label">Zoom:</span>
                    <span className="instruction-description">Middle mouse, or mousewheel / touch: two-finger spread or squish</span>
                </div>
                <div className="instruction-item">
                    <span className="instruction-label">Pan:</span>
                    <span className="instruction-description">Right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move</span>
                </div>
            </div>
            <button className="close-button" onClick={toggleVisibility}>
                ×
            </button>
        </div>
    )
}

export default Instructions