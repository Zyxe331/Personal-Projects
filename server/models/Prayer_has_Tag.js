/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Prayer_has_Tag', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Tag_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Tag',
				key: 'Id'
			}
		},
		PrayerRequest_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'PrayerRequest',
				key: 'Id'
			},
		}
	}, {
		sequelize,
		tableName: 'Prayer_has_Tag'
	});
};
