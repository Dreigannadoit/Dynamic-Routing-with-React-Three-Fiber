import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/AddMob.css';

const AddMob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        type: 'Passive',
        health: 10,
        damage: '',
        behavior: '',
        habitat: '',
        rarity: 'Common',
        description: '',
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

    const [files, setFiles] = useState({
        model: null,
        image: null,
        banner: null,
        sound: null
    });

    const [filePreviews, setFilePreviews] = useState({
        model: null,
        image: null,
        banner: null,
        sound: null
    });

    const mobTypes = ['Passive', 'Neutral', 'Hostile', 'Boss', 'Utility'];

    const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Legendary'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (fieldName, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFiles(prev => ({
            ...prev,
            [fieldName]: file
        }));

        if (fieldName === 'image' || fieldName === 'banner') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreviews(prev => ({
                    ...prev,
                    [fieldName]: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData({
            ...formData,
            [parent]: {
                ...formData[parent],
                [field]: parseFloat(value) || 0
            }
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (fieldName, e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileChange(fieldName, { target: { files: [file] } });
        }
    };


    const handleAddToArray = (arrayName, value) => {
        if (value.trim() === '') return;

        setFormData({
            ...formData,
            [arrayName]: [...formData[arrayName], value.trim()],
            [`new${arrayName.charAt(0).toUpperCase() + arrayName.slice(1)}`]: ''
        });
    };

    const handleRemoveFromArray = (arrayName, index) => {
        const newArray = formData[arrayName].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [arrayName]: newArray
        });
    };

    // Validate form
    const validateForm = () => {
        const requiredFields = ['name', 'health', 'damage', 'behavior', 'habitat', 'description'];
        const missingFields = [];

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            setError(`Please fill in required fields: ${missingFields.join(', ')}`);
            return false;
        }

        // Check if at least image is uploaded
        if (!files.image) {
            setError('Please upload at least an image for the mob');
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);
        setUploadProgress({});

        try {
            // Create FormData for file upload
            const formDataToSend = new FormData();

            // Add form data
            Object.keys(formData).forEach(key => {
                if (key.startsWith('new')) return; // Skip temp input fields

                if (key === 'drops' || key === 'weaknesses' || key === 'abilities') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (key === 'position' || key === 'rotation') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add files
            Object.keys(files).forEach(key => {
                if (files[key]) {
                    formDataToSend.append(key, files[key]);
                }
            });

            // Upload with progress tracking
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setUploadProgress({
                        ...uploadProgress,
                        overall: Math.round(percentComplete)
                    });
                }
            });

            xhr.addEventListener('load', async () => {
                if (xhr.status === 201) {
                    const data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        setSuccess(true);
                        resetForm();

                        // Redirect to home page after 3 seconds
                        setTimeout(() => {
                            navigate('/');
                        }, 3000);
                    } else {
                        setError(data.message || 'Failed to create mob');
                    }
                } else {
                    const errorData = JSON.parse(xhr.responseText);
                    setError(errorData.message || 'Upload failed');
                }
                setLoading(false);
            });

            xhr.addEventListener('error', () => {
                setError('Network error. Please check your connection.');
                setLoading(false);
            });

            xhr.open('POST', 'http://localhost:5000/api/mobs');
            xhr.send(formDataToSend);

        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Error submitting form:', err);
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            type: 'Passive',
            health: 10,
            damage: '',
            behavior: '',
            habitat: '',
            rarity: 'Common',
            description: '',
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

        setFiles({
            model: null,
            image: null,
            banner: null,
            sound: null
        });

        setFilePreviews({
            model: null,
            image: null,
            banner: null,
            sound: null
        });

        setUploadProgress({});
    };

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

    const getFileRequirements = (field) => {
        const requirements = {
            model: '3D Model (.glb, .gltf) - Max 50MB',
            image: 'Image (.jpg, .jpeg, .png, .gif, .webp) - Max 10MB',
            banner: 'Banner Image (.jpg, .jpeg, .png, .gif, .webp) - Max 10MB',
            sound: 'Sound (.mp3, .wav, .ogg) - Max 10MB'
        };
        return requirements[field] || 'Upload file';
    };

    // Remove a file
    const removeFile = (fieldName) => {
        setFiles(prev => ({
            ...prev,
            [fieldName]: null
        }));

        setFilePreviews(prev => ({
            ...prev,
            [fieldName]: null
        }));
    };

    return (
        <div className="add-mob-page">
            <div className="add-mob-container">
                <div className="add-mob-header">
                    <h1>Add New Minecraft Mob</h1>
                    <p className="subtitle">Upload mob details and assets below</p>
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

                {uploadProgress.overall > 0 && uploadProgress.overall < 100 && (
                    <div className="upload-progress">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${uploadProgress.overall}%` }}
                            ></div>
                        </div>
                        <p>Uploading: {uploadProgress.overall}%</p>
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

                    {/* File Uploads Section */}
                    <div className="form-section">
                        <h2>Upload Assets</h2>
                        <div className="file-uploads-grid">
                            {/* Image Upload */}
                            <div className="file-upload-group">
                                <label className="file-upload-label">
                                    <span>Mob Image *</span>
                                    <span className="file-requirements">
                                        {getFileRequirements('image')}
                                    </span>
                                </label>
                                <div className="file-upload-area">
                                    {filePreviews.image ? (
                                        <div className="file-preview">
                                            <img
                                                src={filePreviews.image}
                                                alt="Preview"
                                                className="image-preview"
                                            />
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={() => removeFile('image')}
                                            >
                                                × Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="file-input-wrapper">
                                            <input
                                                type="file"
                                                id="image"
                                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                                onChange={(e) => handleFileChange('image', e)}
                                                className="file-input"
                                            />
                                            <label
                                                htmlFor="image"
                                                className="file-drop-area"
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop('image', e)}
                                            >
                                                <span>Click to upload image</span>
                                                <span className="file-hint">or drag and drop</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="file-upload-group">
                                <label className="file-upload-label">
                                    <span>3D Model</span>
                                    <span className="file-requirements">
                                        {getFileRequirements('model')}
                                    </span>
                                </label>
                                <div className="file-upload-area">
                                    {files.model ? (
                                        <div className="file-preview">
                                            <div className="model-preview">
                                                <span className="model-icon">🧊</span>
                                                <span className="file-name">{files.model.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={() => removeFile('model')}
                                            >
                                                × Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="file-input-wrapper">
                                            <input
                                                type="file"
                                                id="model"
                                                accept=".glb,.gltf"
                                                onChange={(e) => handleFileChange('model', e)}
                                                className="file-input"
                                            />
                                            <label
                                                htmlFor="model" c
                                                lassName="file-drop-area"
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop('image', e)}
                                            >
                                                <span className="upload-icon">🧊</span>
                                                <span>Click to upload 3D model</span>
                                                <span className="file-hint">.glb or .gltf format</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Banner Upload */}
                            <div className="file-upload-group">
                                <label className="file-upload-label">
                                    <span>Banner Image</span>
                                    <span className="file-requirements">
                                        {getFileRequirements('banner')}
                                    </span>
                                </label>
                                <div className="file-upload-area">
                                    {filePreviews.banner ? (
                                        <div className="file-preview">
                                            <img
                                                src={filePreviews.banner}
                                                alt="Banner Preview"
                                                className="image-preview"
                                            />
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={() => removeFile('banner')}
                                            >
                                                × Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="file-input-wrapper">
                                            <input
                                                type="file"
                                                id="banner"
                                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                                onChange={(e) => handleFileChange('banner', e)}
                                                className="file-input"
                                            />
                                            <label
                                                htmlFor="banner"
                                                className="file-drop-area"
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop('image', e)}

                                            >
                                                <span className="upload-icon">🏳️</span>
                                                <span>Click to upload banner</span>
                                                <span className="file-hint">for slider display</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sound Upload */}
                            <div className="file-upload-group">
                                <label className="file-upload-label">
                                    <span>Sound</span>
                                    <span className="file-requirements">
                                        {getFileRequirements('sound')}
                                    </span>
                                </label>
                                <div className="file-upload-area">
                                    {files.sound ? (
                                        <div className="file-preview">
                                            <div className="sound-preview">
                                                <span className="sound-icon">🔊</span>
                                                <span className="file-name">{files.sound.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={() => removeFile('sound')}
                                            >
                                                × Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="file-input-wrapper">
                                            <input
                                                type="file"
                                                id="sound"
                                                accept=".mp3,.wav,.ogg"
                                                onChange={(e) => handleFileChange('sound', e)}
                                                className="file-input"
                                            />
                                            <label htmlFor="sound"
                                                className="file-drop-area"
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop('image', e)}
                                            >
                                                <span className="upload-icon">🔊</span>
                                                <span>Click to upload sound</span>
                                                <span className="file-hint">.mp3, .wav, or .ogg</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
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
                                    onChange={(e) => setFormData({ ...formData, newDrop: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, newWeakness: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, newAbility: e.target.value })}
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
                            onClick={resetForm}
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