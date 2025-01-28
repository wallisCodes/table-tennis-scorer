import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Player extends Model {}

Player.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        colour: {
            type: DataTypes.STRING, // HEX colour
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'player',
        tableName: 'players'
    }
);

export default Player;