import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class MatchPlayer extends Model {}

MatchPlayer.init(
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
        finalScore: DataTypes.INTEGER
    },
    {
        sequelize,
        modelName: 'match_player',
        tableName: 'match_player'
    }
);

export default MatchPlayer;