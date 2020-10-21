/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Group', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Name: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		CreatedDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		Active: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: 1
		},
		Plan_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Plan',
				key: 'Id'
			}
		}
	}, {
		sequelize,
		tableName: 'Group'
	});
};
