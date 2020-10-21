/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ContentCycle', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Cycle_Number: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		CreatedDate: {
			type: DataTypes.DATE,
			allowNull: false
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
		tableName: 'ContentCycle'
	});
};
