import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Match extends Model {}

Match.init(
    {
        sport: {
            type: DataTypes.STRING,
            allowNull: false
        },
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
            field: 'end_time'
        },
        matchDuration: {
            type: DataTypes.INTEGER, // Unix timestamp duration
            field: 'match_duration'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            field: 'user_id'
        },
        winnerId: {
            type: DataTypes.INTEGER,
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