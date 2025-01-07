import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Match extends Model {}

Match.init(
    {
        sport: DataTypes.STRING,
        date: {
            type: DataTypes.INTEGER, // Unix timestamp format
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME, // hh:mm:ss format
            allowNull: false,
            field: 'start_time'
        },
        endTime: {
            type: DataTypes.TIME, // hh:mm:ss format
            allowNull: true,
            field: 'end_time'
        },
        matchDuration: {
            type: DataTypes.INTEGER, // Unix timestamp duration
            allowNull: true,
            field: 'match_duration'
        },
        winnerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'players',
                key: 'id'
            },
            field: 'winner_id'
        }
    },
    {
        sequelize,
        modelName: 'match',
        tableName: 'matches'
    }
);

export default Match;