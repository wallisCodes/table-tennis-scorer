import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class ScoreHistory extends Model {}

ScoreHistory.init(
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
        winner: DataTypes.STRING
    },
    {
        sequelize,
        modelName: 'score_history',
        tableName: 'score_history'
    }
);

export default ScoreHistory;