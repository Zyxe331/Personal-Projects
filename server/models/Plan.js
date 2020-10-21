/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Plan', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Title: {
			type: DataTypes.TEXT('tiny'),
			allowNull: false
		},
		CreatedDate: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		sequelize,
		tableName: 'Plan'
	});
};
