const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Mob = require('./models/Mob');

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileType = file.fieldname;
        let folder = 'uploads/';
        
        if (fileType === 'model') folder += 'models/';
        else if (fileType === 'image') folder += 'images/';
        else if (fileType === 'banner') folder += 'banners/';
        else if (fileType === 'sound') folder += 'sounds/';
        
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueName + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = {
            'model': ['.glb', '.gltf'],
            'image': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
            'banner': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
            'sound': ['.mp3', '.wav', '.ogg']
        };
        
        const fileType = file.fieldname;
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (allowedTypes[fileType] && allowedTypes[fileType].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type for ${fileType}. Allowed: ${allowedTypes[fileType].join(', ')}`));
        }
    }
});

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Database Connected Successfully');
        seedInitialData();
    })
    .catch((err) => {
        console.error('❌ Database Connection Error:', err.message);
    });

async function seedInitialData() {
    try {
        const mobCount = await Mob.countDocuments();

        if (mobCount === 0) {
            console.log('📦 Seeding initial mobs data...');
            
            await ensureSampleAssets();
            
            const initialMobs = [
                {
                    id: "1",
                    name: "Pig",
                    type: "Passive",
                    health: 10,
                    damage: "0 (None)",
                    behavior: "Follows Player if player holds a carrot",
                    habitat: "Everywhere",
                    drops: ["Pork Chops", "Raw Porkchop"],
                    rarity: "Common",
                    description: "A pig is a passive mob found commonly in most grass biomes. They can be bred using carrots, potatoes, or beetroots, and can be equipped with a saddle to ride.",
                    model: "/uploads/models/pig.glb",
                    image: "/uploads/images/pig.png",
                    banner: "/uploads/banners/pig_banner.png",
                    sound: "/uploads/sounds/pig.mp3",
                    scale: 0.75,
                    position: { x: 0, y: -3, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    weaknesses: ["Fall damage", "Environmental hazards", "Zombies"],
                    abilities: ["Can be ridden with saddle", "Can be bred", "Eats crops"]
                },
                {
                    id: "2",
                    name: "Creeper",
                    type: "Hostile",
                    health: 20,
                    damage: "49 (Explosion)",
                    behavior: "Sneaks up on players and explodes",
                    habitat: "Overworld, Dark areas",
                    drops: ["Gunpowder", "Music Disc (rare)"],
                    rarity: "Common",
                    description: "A hostile mob that silently approaches players and explodes, causing massive damage to players and the environment. Known for its distinctive green pixelated appearance and hissing sound before detonation.",
                    model: "/uploads/models/creeper.glb",
                    image: "/uploads/images/creeper.png",
                    banner: "/uploads/banners/creeper_banner.png",
                    sound: "/uploads/sounds/creeper.mp3",
                    scale: 0.8,
                    position: { x: 0, y: -10, z: 0 },
                    rotation: { x: 0, y: 180, z: 0 },
                    weaknesses: ["Cats", "Ranged attacks", "Skeletons"],
                    abilities: ["Explosion", "Silent movement", "Charged variant in thunderstorms"]
                },
                {
                    id: "3",
                    name: "Enderman",
                    type: "Neutral",
                    health: 40,
                    damage: "7 per hit",
                    behavior: "Teleports when attacked or when looked at in the eyes",
                    habitat: "The End, Nighttime Overworld",
                    drops: ["Ender Pearl", "End Stone (carried)"],
                    rarity: "Uncommon",
                    description: "A tall, dark mob that can teleport and pick up blocks. Becomes hostile when players look directly at its face. Known for its deep vocal sounds and ability to traverse dimensions.",
                    model: "/uploads/models/enderman.glb",
                    image: "/uploads/images/enderman.png",
                    banner: "/uploads/banners/enderman_banner.png",
                    sound: "/uploads/sounds/enderman.mp3",
                    scale: 0.65,
                    position: { x: 0, y: 7.5, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    weaknesses: ["Water", "Rain", "Small spaces"],
                    abilities: ["Teleportation", "Block carrying", "Damage resistance"]
                }
            ];

            await Mob.insertMany(initialMobs);
            console.log('✅ Initial mobs seeded successfully');
            console.log(`📊 Added ${initialMobs.length} mobs to database`);
        } else {
            console.log(`✅ Database already has ${mobCount} mobs`);
        }
    } catch (error) {
        console.error('❌ Error seeding initial data:', error.message);
    }
}

// Helper function to create sample asset files (placeholder)
async function ensureSampleAssets() {
    const assetFolders = [
        'uploads/models',
        'uploads/images', 
        'uploads/banners',
        'uploads/sounds'
    ];
    
    assetFolders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
            console.log(`📁 Created folder: ${folder}`);
        }
    });
    
    // Create placeholder README files
    const readmeContent = `# Placeholder Assets
    
This folder contains uploaded assets for Minecraft mobs.
When users upload files through the web interface, they will appear here.

Supported file types:
- Models: .glb, .gltf
- Images: .jpg, .jpeg, .png, .gif, .webp
- Sounds: .mp3, .wav, .ogg

Upload your own assets through the "Add New Mob" page!`;

    assetFolders.forEach(folder => {
        const readmePath = path.join(folder, 'README.md');
        if (!fs.existsSync(readmePath)) {
            fs.writeFileSync(readmePath, readmeContent);
        }
    });
}

// Routes

// GET all mobs
app.get('/api/mobs', async (req, res) => {
    try {
        const mobs = await Mob.find().sort({ id: 1 });
        res.status(200).json({
            success: true,
            count: mobs.length,
            data: mobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

// GET single mob by ID
app.get('/api/mobs/:id', async (req, res) => {
    try {
        const mob = await Mob.findOne({ id: req.params.id });

        if (!mob) {
            return res.status(404).json({
                success: false,
                message: 'Mob not found'
            });
        }

        res.status(200).json({
            success: true,
            data: mob
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

app.post('/api/mobs', upload.fields([
    { name: 'model', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'sound', maxCount: 1 }
]), async (req, res) => {
    try {
        if (!req.body.id) {
            const lastMob = await Mob.findOne().sort({ id: -1 });
            const lastId = lastMob ? parseInt(lastMob.id) : 0;
            req.body.id = (lastId + 1).toString();
        }

        if (typeof req.body.drops === 'string') {
            req.body.drops = JSON.parse(req.body.drops);
        }
        if (typeof req.body.weaknesses === 'string') {
            req.body.weaknesses = JSON.parse(req.body.weaknesses);
        }
        if (typeof req.body.abilities === 'string') {
            req.body.abilities = JSON.parse(req.body.abilities);
        }
        
        if (typeof req.body.position === 'string') {
            req.body.position = JSON.parse(req.body.position);
        }
        if (typeof req.body.rotation === 'string') {
            req.body.rotation = JSON.parse(req.body.rotation);
        }

        const fileUrls = {};
        
        if (req.files) {
            if (req.files.model) {
                fileUrls.model = `/uploads/models/${req.files.model[0].filename}`;
            }
            if (req.files.image) {
                fileUrls.image = `/uploads/images/${req.files.image[0].filename}`;
            }
            if (req.files.banner) {
                fileUrls.banner = `/uploads/banners/${req.files.banner[0].filename}`;
            }
            if (req.files.sound) {
                fileUrls.sound = `/uploads/sounds/${req.files.sound[0].filename}`;
            }
        }

        const mobData = {
            ...req.body,
            ...fileUrls
        };

        const mob = await Mob.create(mobData);

        res.status(201).json({
            success: true,
            message: 'Mob created successfully',
            data: mob
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating mob',
            error: error.message
        });
    }
});

app.put('/api/mobs/:id', upload.fields([
    { name: 'model', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'sound', maxCount: 1 }
]), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.files) {
            if (req.files.model) {
                updateData.model = `/uploads/models/${req.files.model[0].filename}`;
            }
            if (req.files.image) {
                updateData.image = `/uploads/images/${req.files.image[0].filename}`;
            }
            if (req.files.banner) {
                updateData.banner = `/uploads/banners/${req.files.banner[0].filename}`;
            }
            if (req.files.sound) {
                updateData.sound = `/uploads/sounds/${req.files.sound[0].filename}`;
            }
        }

        const mob = await Mob.findOneAndUpdate(
            { id: req.params.id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!mob) {
            return res.status(404).json({
                success: false,
                message: 'Mob not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Mob updated successfully',
            data: mob
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating mob',
            error: error.message
        });
    }
});

app.delete('/api/mobs/:id', async (req, res) => {
    try {
        const mob = await Mob.findOneAndDelete({ id: req.params.id });

        if (!mob) {
            return res.status(404).json({
                success: false,
                message: 'Mob not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Mob deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

app.post('/api/upload-test', upload.single('file'), (req, res) => {
    res.json({
        success: true,
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uploadsDir: path.join(__dirname, 'uploads')
    });
});

app.get('/api/uploads', (req, res) => {
    try {
        const files = [];
        
        const scanDir = (dir, basePath = '') => {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                const relativePath = path.join(basePath, item).replace(/\\/g, '/');
                
                if (stat.isDirectory()) {
                    scanDir(fullPath, relativePath);
                } else {
                    files.push({
                        name: item,
                        path: `/uploads/${relativePath}`,
                        size: stat.size,
                        modified: stat.mtime
                    });
                }
            });
        };
        
        if (fs.existsSync(uploadsDir)) {
            scanDir(uploadsDir);
        }
        
        res.json({
            success: true,
            count: files.length,
            files: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reading uploads',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 CORS enabled for: http://localhost:5173`);
    console.log(`🗄️  MongoDB URI: ${process.env.MONGODB_URI}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
    console.log(`📤 File uploads available at: http://localhost:${PORT}/uploads/`);
});