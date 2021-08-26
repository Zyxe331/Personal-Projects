/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User_has_Group', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Group_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Group',
				key: 'Id'
			},
		},
		GroupRole_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'GroupRole',
				key: 'Id'
			},
		},
		User_has_Plan_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'User_has_Plan',
				key: 'Id'
			},
		},
		Active: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		}
	}, {
		sequelize,
		tableName: 'User_has_Group'
	});
};
