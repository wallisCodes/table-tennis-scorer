import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Implement NODE_ENV env variable
            sameSite: "Strict", // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json(newUser);

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        // console.log("Generated Token for User:", token);

        // Set JWT as HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS in production
            sameSite: "Strict", // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json(existingUser);
        // res.status(200).json({ id: existingUser.id, email: existingUser.email });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const logoutUser = (req, res) => {
    console.log("Logging out user...");
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict"
    });
    res.status(200).json({ message: "Logged out successfully!" });
};


export const verifyToken = async (req, res) => {
    try {
        // Get token from HTTP-only cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorised (no token provided)" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user ID from token & return user data
        const user = await User.findByPk(decoded.userId, { attributes: ["id", "email"] });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
        
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};