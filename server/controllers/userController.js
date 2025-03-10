import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "Email already in use" });

        // Hash password to create new user with
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword });

        // Generate JWT token
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Implement NODE_ENV env variable
            sameSite: 'Strict', // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS in production
            sameSite: 'Strict', // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ user: { id: user.id, username: user.username, email: user.email } });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};