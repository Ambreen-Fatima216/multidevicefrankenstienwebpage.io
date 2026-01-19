import express from 'express';
import User from '../Models/userModel.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Create new user using the schema fields: name, email, password
        const newUser = new User({ name, email, password });
        await newUser.save();
        
        res.status(201).json({
            message: "Profile created in the Archive",
            user: { name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        // Handle duplicate emails or validation errors
        res.status(500).json({ message: error.message });
    }
});

// Matches id="login-btn" logic
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by email
        const user = await User.findOne({ email });
        // 2. Check if user exists first to prevent crashes
        if (!user) {
            return res.status(400).json({ message: 'Identity not found in the Archive' });
        }
        // 3. Compare passwords (Note: In production, use bcrypt to compare hashes)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials for Lab access' });
        }
        // 4. Success response
        res.json({ 
            message: `Welcome back, ${user.name}`,
            user: { name: user.name, email: user.email } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;