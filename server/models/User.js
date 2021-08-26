/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Email: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: "Email_UNIQUE"
		},
		Password: {
			type: DataTypes.STRING(60),
			allowNull: false
		},
		FirstName: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		LastName: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		Active: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		CreatedDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		PhoneNumber: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		Role_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Role',
				key: 'Id'
			},
		},
		Username: {
			type: DataTypes.STRING(45),
			allowNull: true,
		}
	}, {
		sequelize,
		tableName: 'User'
	});
};
