/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Tag', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Name: {
			type: DataTypes.STRING(45),
			allowNull: true,
			unique: "Name_UNIQUE"
		},
		Active: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		sequelize,
		tableName: 'Tag'
	});
};
