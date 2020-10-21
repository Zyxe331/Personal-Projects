/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Journal', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Title: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		Body: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		CreatedDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		User_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'User',
				key: 'Id'
			},
		},
		Section_Id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'Section',
				key: 'Id'
			},
		}
	}, {
		sequelize,
		tableName: 'Journal'
	});
};
