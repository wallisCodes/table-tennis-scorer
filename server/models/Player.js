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
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            field: 'user_id'
        }
    },
    {
        sequelize,
        modelName: 'player',
        tableName: 'players'
    }
);

export default Player;