/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Notification_Type', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Name: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		Ion_Icon: {
			type: DataTypes.STRING(45),
			allowNull: true
		}
	}, {
		sequelize,
		tableName: 'Notification_Type'
	});
};
