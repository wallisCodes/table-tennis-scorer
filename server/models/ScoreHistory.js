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
            }
        },
        playerId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'players',
                key: 'id'
            }
        },
        timestamp: DataTypes.DATE,
        scoreEvent: DataTypes.JSONB // Flexible format for event details
    },
    {
        sequelize,
        modelName: 'score_history',
        tableName: 'score_history'
    }
);

export default ScoreHistory;