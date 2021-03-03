/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('PrayerRequest', {
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
			type: DataTypes.TEXT('tiny'),
			allowNull: true
		},
		Resolved: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		IsPrivate: {
			type: DataTypes.INTEGER,
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
			}
		},
		Frequency: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		NotificationDate: {
			type: DataTypes.STRING(40),
			allowNull: true
		},
		NotificationTime: {
			type: DataTypes.STRING(40),
			allowNull: true
		},
		Section_Id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'Section',
				key: 'Id'
			}
		}
	}, {
		sequelize,
		tableName: 'PrayerRequest'
	});
};
