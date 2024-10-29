import "dotenv/config";
import cors from "cors";
import express from "express";
import models from './models/index.js';
import routes from './routes/index.js';
// import routes from './routes';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

console.log(`Test key from .env file: ${process.env.TEST_KEY}`);

app.use((req, res, next) => {
    req.context = {
        models,
        me: models.players[1],
    };
    next();
});

app.use('/session', routes.session);
app.use('/players', routes.player);
app.use('/messages', routes.message);



app.listen(process.env.PORT, () => {
    console.log(`My first Express app - listening on port ${process.env.PORT}!`);
});