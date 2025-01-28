import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class ScoreHistory extends Model {}

ScoreHistory.init(
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
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        winner: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'score_history',
        tableName: 'score_history'
    }
);

export default ScoreHistory;