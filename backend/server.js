const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Mob = require('./models/Mob');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

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
            const initialMobs = [
                {
                    id: "1",
                    name: "Pig",
                    type: "Passive",
                    health: 10,
                    damage: "0 (None)",
                    behavior: "Follows Player if player holds a carrot",
                    habitat: "Everywhere",
                    drops: ["Pork Chops"],
                    rarity: "Common",
                    description: "A pig is a passive mob found commonly in most grass biomes...",
                    model: "/models/pig.glb",
                    image: "/images/pig.png",
                    banner: "/banners/pig_banner.png",
                    sound: "/sounds/pig.mp3",
                    scale: 0.75,
                    position: { x: 0, y: -3, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    weaknesses: ["Fall damage", "Environmental hazards"],
                    abilities: ["Eats Grass"]
                },
                {
                    id: "2",
                    name: "Iron Golem",
                    type: "Neutral",
                    health: 100,
                    damage: "7-21",
                    behavior: "Protects villagers and attacks hostile mobs",
                    habitat: "Villages",
                    drops: ["Iron Ingots", "Poppy"],
                    rarity: "Uncommon",
                    description: "Iron Golems are utility mobs that protect villagers...",
                    model: "/models/iron_golem.glb",
                    image: "/images/iron_golem.png",
                    banner: "/banners/iron_golem_banner.png",
                    sound: "/sounds/iron_golem.mp3",
                    scale: 0.8,
                    position: { x: 0, y: 8, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    weaknesses: ["Water", "Cacti"],
                    abilities: ["Throwing Attack", "Village Protection"]
                },
                {
                    id: "3",
                    name: "Creeper",
                    type: "Hostile",
                    health: 20,
                    damage: "49 (Explosion)",
                    behavior: "Sneaks up on players and explodes",
                    habitat: "Overworld, Dark areas",
                    drops: ["Gunpowder"],
                    rarity: "Common",
                    description: "A hostile mob that silently approaches players and explodes...",
                    model: "/models/creeper.glb",
                    image: "/images/creeper.png",
                    banner: "/banners/creeper_banner.png",
                    sound: "/sounds/creeper.mp3",
                    scale: 0.8,
                    position: { x: 0, y: -10, z: 0 },
                    rotation: { x: 0, y: 180, z: 0 },
                    weaknesses: ["Cats", "Ranged attacks"],
                    abilities: ["Explosion", "Silent movement"]
                },
                {
                    id: "4",
                    name: "Enderman",
                    type: "Neutral",
                    health: 40,
                    damage: "7",
                    behavior: "Teleports when attacked or when looked at in the eyes",
                    habitat: "The End, Nighttime Overworld",
                    drops: ["Ender Pearl"],
                    rarity: "Uncommon",
                    description: "A tall, dark mob that can teleport and pick up blocks...",
                    model: "/models/enderman.glb",
                    image: "/images/enderman.png",
                    banner: "/banners/enderman_banner.png",
                    sound: "/sounds/enderman.mp3",
                    scale: 0.65,
                    position: { x: 0, y: 7.5, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 },
                    weaknesses: ["Water", "Rain"],
                    abilities: ["Teleportation", "Block carrying"]
                }
            ];

            await Mob.insertMany(initialMobs);
            console.log('✅ Initial mobs seeded successfully');
        } else {
            console.log(`✅ Database already has ${mobCount} mobs`);
        }
    } catch (error) {
        console.error('❌ Error seeding initial data:', error.message);
    }
}

app.get('/api/mobs', async (req, res) => {
    try {
        const mobs = await Mob.find().sort({ createdAt: -1 });
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

app.post('/api/mobs', async (req, res) => {
    try {
        // Generate a unique ID if not provided
        if (!req.body.id) {
            const lastMob = await Mob.findOne().sort({ id: -1 });
            const lastId = lastMob ? parseInt(lastMob.id) : 0;
            req.body.id = (lastId + 1).toString();
        }

        const mob = await Mob.create(req.body);

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

app.put('/api/mobs/:id', async (req, res) => {
    try {
        const mob = await Mob.findOneAndUpdate(
            { id: req.params.id },
            req.body,
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

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 CORS enabled for: http://localhost:5173`);
    console.log(`🗄️  MongoDB URI: ${process.env.MONGODB_URI}`);
});