import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import './models/index.js';
import sequelize from './config/database.js';
import matchRoutes from "./routes/matchRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import scoreHistoryRoutes from "./routes/scoreHistoryRoutes.js";
import heartRateRoutes from "./routes/heartRateRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// /api included in path to make it obvious this is a backend API call
app.use('/api/matches', matchRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/score-history', scoreHistoryRoutes);
app.use('/api/heart-rate', heartRateRoutes);


// Testing connection
// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }


// Sync database and start server
const PORT = process.env.PORT || 3000;
// change sync options for production { alter: true }
sequelize.sync({ alter: true }).then(() => {
    console.log("Database synchronized");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
    console.error('Failed to sync database:', error);
});