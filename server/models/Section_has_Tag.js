/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Section_has_Tag', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Section_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Section',
				key: 'Id'
			}
		},
		Tag_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Tag',
				key: 'Id'
			}
		}
	}, {
		sequelize,
		tableName: 'Section_has_Tag'
	});
};
