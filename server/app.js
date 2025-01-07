import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import './models/index.js';
import sequelize from './config/database.js';
import playerRoutes from "./routes/playerRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import scoreHistoryRoutes from "./routes/scoreHistoryRoutes.js";
import heartRateRoutes from "./routes/heartRateRoutes.js";

const app = express();
// app.use(cors());
app.use(cors({
    // origin: 'http://localhost:5173/table-tennis-scorer',
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.options('*', cors()); // Handles preflight requests


// /api included in path to make it obvious this is a backend API call
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/score-history', scoreHistoryRoutes);
app.use('/api/heart-rate', heartRateRoutes);


// Sync database and start server
const PORT = process.env.PORT || 3000;
// change sync options for production { alter: true }
// sequelize.sync().then(() => {
sequelize.sync({ force: true }).then(() => {
// sequelize.sync({ alter: true }).then(() => {
    console.log("Database synchronized");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
    console.error('Failed to sync database:', error);
});