/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User_has_Plan', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		User_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'User',
				key: 'Id'
			},
		},
		Plan_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Plan',
				key: 'Id'
			},
		},
		Current_Section_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Section',
				key: 'Id'
			},
		},
		Active: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		Times_Completed: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		}
	}, {
		sequelize,
		tableName: 'User_has_Plan'
	});
};
