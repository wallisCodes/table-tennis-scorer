import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Match extends Model {}

Match.init(
    {
        sport: DataTypes.STRING,
        bestOf: DataTypes.INTEGER,
        matchDuration: DataTypes.TIME,
        winnerId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'players',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'match',
        tableName: 'matches'
    }
);

export default Match;