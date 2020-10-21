/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('GroupRole', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Name: {
			type: DataTypes.STRING(45),
			allowNull: true
		}
	}, {
		sequelize,
		tableName: 'GroupRole'
	});
};
