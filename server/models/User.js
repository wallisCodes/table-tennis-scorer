import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING, // Hashed using bcrypt
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'user',
        tableName: 'users'
    }
);

export default User;