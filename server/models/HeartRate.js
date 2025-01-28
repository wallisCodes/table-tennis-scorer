import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class HeartRate extends Model {}

HeartRate.init(
    {
        matchId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'matches',
                key: 'id'
            },
            field: 'match_id'
        },
        playerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'players',
                key: 'id'
            },
            field: 'player_id'
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'heart_rate',
        tableName: 'heart_rate'
    }
);

export default HeartRate;