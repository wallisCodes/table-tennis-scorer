import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import './models/index.js';
import sequelize from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import playerRoutes from "./routes/playerRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import matchPlayerRoutes from "./routes/matchPlayerRoutes.js";
import scoreHistoryRoutes from "./routes/scoreHistoryRoutes.js";
import heartRateRoutes from "./routes/heartRateRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://t-racket.com' // frontend URL making API calls
        : 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));
// app.options('*', cors()); // Handles preflight requests
console.log("NODE_ENV:", process.env.NODE_ENV);

// /api included in path to make it obvious this is a backend API call
app.use('/api/user', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/match-player', matchPlayerRoutes);
app.use('/api/score-history', scoreHistoryRoutes);
app.use('/api/heart-rate', heartRateRoutes);

// Quickly check API's work
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Sync database and start server
const PORT = process.env.PORT || 3000;
// sequelize.sync({ force: true }).then(() => {
sequelize.sync({ alter: true }).then(() => {
    console.log("Database synchronized");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
    console.error('Failed to sync database:', error);
});