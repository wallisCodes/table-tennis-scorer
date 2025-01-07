import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Player extends Model {}

Player.init(
    {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        colour: DataTypes.STRING // HEX colour
    },
    {
        sequelize,
        modelName: 'player',
        tableName: 'players'
    }
);

export default Player;