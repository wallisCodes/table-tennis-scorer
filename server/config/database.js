import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
isProduction && console.log(`Current time inside databse.js: ${new Date()}`);

// Create sequelize instance based on node environment
const sequelize = isProduction
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false, 
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Required for AWS RDS
            }
        }
    })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'postgres',
            logging: false
            // logging: console.log
        }
);

export default sequelize;