import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class HeartRate extends Model {}

HeartRate.init(
    {
        matchId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'matches',
                key: 'id'
            },
            field: 'match_id'
        },
        playerId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'players',
                key: 'id'
            },
            field: 'player_id'
        },
        time: DataTypes.STRING,
        value: DataTypes.INTEGER
    },
    {
        sequelize,
        modelName: 'heart_rate',
        tableName: 'heart_rate'
    }
);

export default HeartRate;