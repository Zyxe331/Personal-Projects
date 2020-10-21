/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Section', {
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
		Passage_Paraphrased: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Passage_Reference: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Additional_Thoughts: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Order: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		CreatedDate: {
			type: DataTypes.DATE,
			allowNull: true
		},
		ContentCycle_Id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			references: {
				model: 'ContentCycle',
				key: 'Id'
			},
			unique: "fk_Section_ContentCycle1"
		},
		Main_Idea: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		Song_Link: {
			type: DataTypes.TEXT('tiny'),
			allowNull: true
		}
	}, {
		sequelize,
		tableName: 'Section'
	});
};
