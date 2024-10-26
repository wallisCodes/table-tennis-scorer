import 'dotenv/config';
import express from "express";
const app = express();

console.log(`Test key from .env file: ${process.env.TEST_KEY}`);


app.get("/", (req, res) => res.send("Hello, world!"));

app.listen(process.env.PORT, () => {
    console.log(`My first Express app - listening on port ${process.env.PORT}!`);
});