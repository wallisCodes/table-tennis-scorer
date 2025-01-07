import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class MatchPlayer extends Model {}

// Each one of these records represents a single player, meaning two records are needed
// to represent each match (singles match)
MatchPlayer.init(
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
        finalScore: {
            type: DataTypes.INTEGER,
            field: 'final_score'
        }
    },
    {
        sequelize,
        modelName: 'match_player',
        tableName: 'match_player'
    }
);

export default MatchPlayer;