import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

console.log(`Current time inside databse.js: ${new Date()}`);
// Debugging env variables
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('typeof DB_PASSWORD:', typeof process.env.DB_PASSWORD);


// Database connection details
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
        // logging: console.log
    }
);

export default sequelize;