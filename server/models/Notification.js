/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Notification', {
		Id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Title: {
			type: DataTypes.TEXT('tiny'),
			allowNull: true
		},
		Body: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Completed: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		Read: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		CreatedDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		To_User_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'User',
				key: 'Id'
			}
		},
		From_User_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'User',
				key: 'Id'
			},
		},
		Notification_Type_Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Notification_Type',
				key: 'Id'
			},
		},
		Group_Id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'Group',
				key: 'Id'
			},
		}
	}, {
		sequelize,
		tableName: 'Notification'
	});
};
