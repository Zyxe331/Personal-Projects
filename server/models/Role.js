/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Role', {
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
		tableName: 'Role'
	});
};
