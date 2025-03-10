import sequelize from '../config/database.js';
import User from './User.js';
import Player from './Player.js';
import Match from './Match.js';
import ScoreHistory from './ScoreHistory.js';
import HeartRate from './HeartRate.js';
import MatchPlayer from './MatchPlayer.js';

// Defining associations
User.hasMany(Match, { foreignKey: 'userId' });

Match.belongsTo(User, { foreignKey: 'userId' });
Match.belongsTo(Player, { as: 'winner', foreignKey: 'winnerId' });

Player.hasMany(Match, { foreignKey: 'winnerId' });

ScoreHistory.belongsTo(Match, { foreignKey: 'matchId' });
ScoreHistory.belongsTo(Player, { foreignKey: 'playerId' });

HeartRate.belongsTo(Match, { foreignKey: 'matchId' });
HeartRate.belongsTo(Player, { foreignKey: 'playerId' });

MatchPlayer.belongsTo(Match, { foreignKey: 'matchId' });
MatchPlayer.belongsTo(Player, { foreignKey: 'playerId' });

export { sequelize, User, Player, Match, ScoreHistory, HeartRate, MatchPlayer };