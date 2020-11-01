/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Message', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Body: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		CreatedDate: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		Group_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Group',
				key: 'Id'
			},
		},
		User_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'User',
				key: 'Id'
			},
		}
	}, {
		sequelize,
		tableName: 'Message'
	});
};
