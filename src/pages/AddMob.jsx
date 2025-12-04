import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../style/AddMob.css';

const AddMob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        type: 'Passive',
        health: 10,
        damage: '',
        behavior: '',
        habitat: '',
        rarity: 'Common',
        description: '',
        model: '',
        image: '',
        banner: '',
        sound: '',
        scale: 1.0,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        drops: [],
        weaknesses: [],
        abilities: [],
        newDrop: '',
        newWeakness: '',
        newAbility: ''
    });

    // Mob type options
    const mobTypes = ['Passive', 'Neutral', 'Hostile', 'Boss', 'Utility'];
    
    // Rarity options
    const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Legendary'];

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle nested object changes (position, rotation)
    const handleNestedChange = (parent, field, value) => {
        setFormData({
            ...formData,
            [parent]: {
                ...formData[parent],
                [field]: parseFloat(value) || 0
            }
        });
    };

    // Handle array additions (drops, weaknesses, abilities)
    const handleAddToArray = (arrayName, value) => {
        if (value.trim() === '') return;
        
        setFormData({
            ...formData,
            [arrayName]: [...formData[arrayName], value.trim()],
            [`new${arrayName.charAt(0).toUpperCase() + arrayName.slice(1)}`]: ''
        });
    };

    // Handle array removals
    const handleRemoveFromArray = (arrayName, index) => {
        const newArray = formData[arrayName].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [arrayName]: newArray
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Prepare data for API
            const mobData = {
                ...formData,
                // Remove temporary input fields
                newDrop: undefined,
                newWeakness: undefined,
                newAbility: undefined
            };

            const response = await fetch('http://localhost:5000/api/mobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mobData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setFormData({
                    name: '',
                    type: 'Passive',
                    health: 10,
                    damage: '',
                    behavior: '',
                    habitat: '',
                    rarity: 'Common',
                    description: '',
                    model: '',
                    image: '',
                    banner: '',
                    sound: '',
                    scale: 1.0,
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    drops: [],
                    weaknesses: [],
                    abilities: [],
                    newDrop: '',
                    newWeakness: '',
                    newAbility: ''
                });

                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(data.message || 'Failed to create mob');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Error submitting form:', err);
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const handleReset = () => {
        setFormData({
            name: '',
            type: 'Passive',
            health: 10,
            damage: '',
            behavior: '',
            habitat: '',
            rarity: 'Common',
            description: '',
            model: '',
            image: '',
            banner: '',
            sound: '',
            scale: 1.0,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            drops: [],
            weaknesses: [],
            abilities: [],
            newDrop: '',
            newWeakness: '',
            newAbility: ''
        });
        setError('');
        setSuccess(false);
    };

    // Get type color for styling
    const getTypeColor = (type) => {
        const colors = {
            'Passive': '#55FF55',
            'Neutral': '#FFAA00',
            'Hostile': '#FF5555',
            'Boss': '#AA00AA',
            'Utility': '#5555FF'
        };
        return colors[type] || '#727272';
    };

    return (
        <div className="add-mob-page">
            <Navbar />
            
            <div className="add-mob-container">
                <div className="add-mob-header">
                    <h1>Add New Minecraft Mob</h1>
                    <p className="subtitle">Fill in the details below to add a new mob to the collection</p>
                </div>

                {success && (
                    <div className="success-message">
                        ✅ Mob added successfully! Redirecting to home page...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mob-form">
                    {/* Basic Information Section */}
                    <div className="form-section">
                        <h2>Basic Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="name">Mob Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter mob name (e.g., Creeper)"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="type">Mob Type *</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                    style={{ borderColor: getTypeColor(formData.type) }}
                                >
                                    {mobTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="health">Health *</label>
                                <input
                                    type="number"
                                    id="health"
                                    name="health"
                                    value={formData.health}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    max="1000"
                                    placeholder="Enter health points"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="damage">Damage *</label>
                                <input
                                    type="text"
                                    id="damage"
                                    name="damage"
                                    value={formData.damage}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., 5-10 or 15 (Explosion)"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="behavior">Behavior *</label>
                                <input
                                    type="text"
                                    id="behavior"
                                    name="behavior"
                                    value={formData.behavior}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., Attacks players at night"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="habitat">Habitat *</label>
                                <input
                                    type="text"
                                    id="habitat"
                                    name="habitat"
                                    value={formData.habitat}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., Forests, The Nether"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="rarity">Rarity *</label>
                                <select
                                    id="rarity"
                                    name="rarity"
                                    value={formData.rarity}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {rarityOptions.map(rarity => (
                                        <option key={rarity} value={rarity}>
                                            {rarity}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="form-section">
                        <h2>Description</h2>
                        <div className="form-group full-width">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="4"
                                placeholder="Enter detailed description of the mob..."
                            />
                        </div>
                    </div>

                    {/* Assets Section */}
                    <div className="form-section">
                        <h2>Assets (URLs)</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="model">3D Model URL *</label>
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., /models/creeper.glb"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="image">Image URL *</label>
                                <input
                                    type="text"
                                    id="image"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., /images/creeper.png"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="banner">Banner URL *</label>
                                <input
                                    type="text"
                                    id="banner"
                                    name="banner"
                                    value={formData.banner}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., /banners/creeper_banner.png"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="sound">Sound URL *</label>
                                <input
                                    type="text"
                                    id="sound"
                                    name="sound"
                                    value={formData.sound}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., /sounds/creeper.mp3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3D Settings Section */}
                    <div className="form-section">
                        <h2>3D Settings</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="scale">Scale</label>
                                <input
                                    type="number"
                                    id="scale"
                                    name="scale"
                                    value={formData.scale}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="0.1"
                                    max="100"
                                />
                            </div>
                        </div>

                        <div className="form-subsection">
                            <h3>Position</h3>
                            <div className="vector-inputs">
                                <div className="vector-input">
                                    <label>X</label>
                                    <input
                                        type="number"
                                        value={formData.position.x}
                                        onChange={(e) => handleNestedChange('position', 'x', e.target.value)}
                                        step="0.1"
                                    />
                                </div>
                                <div className="vector-input">
                                    <label>Y</label>
                                    <input
                                        type="number"
                                        value={formData.position.y}
                                        onChange={(e) => handleNestedChange('position', 'y', e.target.value)}
                                        step="0.1"
                                    />
                                </div>
                                <div className="vector-input">
                                    <label>Z</label>
                                    <input
                                        type="number"
                                        value={formData.position.z}
                                        onChange={(e) => handleNestedChange('position', 'z', e.target.value)}
                                        step="0.1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-subsection">
                            <h3>Rotation</h3>
                            <div className="vector-inputs">
                                <div className="vector-input">
                                    <label>X</label>
                                    <input
                                        type="number"
                                        value={formData.rotation.x}
                                        onChange={(e) => handleNestedChange('rotation', 'x', e.target.value)}
                                        step="0.1"
                                    />
                                </div>
                                <div className="vector-input">
                                    <label>Y</label>
                                    <input
                                        type="number"
                                        value={formData.rotation.y}
                                        onChange={(e) => handleNestedChange('rotation', 'y', e.target.value)}
                                        step="0.1"
                                    />
                                </div>
                                <div className="vector-input">
                                    <label>Z</label>
                                    <input
                                        type="number"
                                        value={formData.rotation.z}
                                        onChange={(e) => handleNestedChange('rotation', 'z', e.target.value)}
                                        step="0.1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Arrays Section */}
                    <div className="form-section">
                        <h2>Arrays</h2>
                        
                        {/* Drops */}
                        <div className="form-subsection">
                            <h3>Drops</h3>
                            <div className="array-input">
                                <input
                                    type="text"
                                    value={formData.newDrop}
                                    onChange={(e) => setFormData({...formData, newDrop: e.target.value})}
                                    placeholder="Enter drop item"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddToArray('drops', formData.newDrop)}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleAddToArray('drops', formData.newDrop)}
                                    className="add-btn"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="array-items">
                                {formData.drops.map((drop, index) => (
                                    <div key={index} className="array-item">
                                        <span>{drop}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveFromArray('drops', index)}
                                            className="remove-btn"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weaknesses */}
                        <div className="form-subsection">
                            <h3>Weaknesses</h3>
                            <div className="array-input">
                                <input
                                    type="text"
                                    value={formData.newWeakness}
                                    onChange={(e) => setFormData({...formData, newWeakness: e.target.value})}
                                    placeholder="Enter weakness"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddToArray('weaknesses', formData.newWeakness)}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleAddToArray('weaknesses', formData.newWeakness)}
                                    className="add-btn"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="array-items">
                                {formData.weaknesses.map((weakness, index) => (
                                    <div key={index} className="array-item">
                                        <span>{weakness}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveFromArray('weaknesses', index)}
                                            className="remove-btn"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Abilities */}
                        <div className="form-subsection">
                            <h3>Abilities</h3>
                            <div className="array-input">
                                <input
                                    type="text"
                                    value={formData.newAbility}
                                    onChange={(e) => setFormData({...formData, newAbility: e.target.value})}
                                    placeholder="Enter ability"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddToArray('abilities', formData.newAbility)}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleAddToArray('abilities', formData.newAbility)}
                                    className="add-btn"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="array-items">
                                {formData.abilities.map((ability, index) => (
                                    <div key={index} className="array-item">
                                        <span>{ability}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveFromArray('abilities', index)}
                                            className="remove-btn"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={handleReset}
                            className="reset-btn"
                            disabled={loading}
                        >
                            Reset Form
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => navigate('/')}
                            className="cancel-btn"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading}
                            style={{ backgroundColor: getTypeColor(formData.type) }}
                        >
                            {loading ? 'Adding Mob...' : 'Add Mob to Database'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMob;