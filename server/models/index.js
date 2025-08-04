import sequelize from '../config/database.js';
import User from './User.js';
import Player from './Player.js';
import Match from './Match.js';
import ScoreHistory from './ScoreHistory.js';
import HeartRate from './HeartRate.js';
import MatchPlayer from './MatchPlayer.js';

// Defining associations
// User-related cascade setup
User.hasMany(Match, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Match.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Player, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Player.belongsTo(User, { foreignKey: 'userId' });


// Match-related cascade setup
Match.hasMany(ScoreHistory, {
    foreignKey: 'matchId',
    onDelete: 'CASCADE'
});
ScoreHistory.belongsTo(Match, { foreignKey: 'matchId' });

Match.hasMany(HeartRate, {
    foreignKey: 'matchId',
    onDelete: 'CASCADE'
});
HeartRate.belongsTo(Match, { foreignKey: 'matchId' });

Match.hasMany(MatchPlayer, {
    foreignKey: 'matchId',
    onDelete: 'CASCADE'
});
MatchPlayer.belongsTo(Match, { foreignKey: 'matchId' });

Match.belongsTo(Player, { as: 'winner', foreignKey: 'winnerId' });
Player.hasMany(Match, { foreignKey: 'winnerId' }); // Purposefully not cascading winner here


// Player-related cascade setup ===
Player.hasMany(ScoreHistory, {
    foreignKey: 'playerId',
    onDelete: 'CASCADE'
});
ScoreHistory.belongsTo(Player, { foreignKey: 'playerId' });

Player.hasMany(HeartRate, {
    foreignKey: 'playerId',
    onDelete: 'CASCADE'
});
HeartRate.belongsTo(Player, { foreignKey: 'playerId' });

Player.hasMany(MatchPlayer, {
    foreignKey: 'playerId',
    onDelete: 'CASCADE'
});
MatchPlayer.belongsTo(Player, { foreignKey: 'playerId' });

export { sequelize, User, Player, Match, ScoreHistory, HeartRate, MatchPlayer };