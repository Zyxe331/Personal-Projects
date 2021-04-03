const AdminBro = require('admin-bro')
const AdminBroExpressjs = require('@admin-bro/express');
const { Sequelize } = require('sequelize');
var SequelizeAuto = require('sequelize-auto');
const AdminBroSequelize = require('@admin-bro/sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const methodOverride = require('method-override')
const cors = require('cors');
const routes = require('./routes');
const dotenv = require('dotenv');
var fs = require('fs')
var https = require('https')
const UsersService = require('./services/users.service')
const sidebarGroups = {
	admin: {
		name: 'Administrator Tables',
		icon: 'Home'
	},
	developer: {
		name: 'Developer Tables',
		icon: 'Settings'
	}
};

// Set up environment file
dotenv.config();

//create the models in ./models
// var auto = new SequelizeAuto(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
// 	host: 'localhost',
// 	port: '3306',
// 	dialect: 'mysql'
// })
// auto.run(function (err) {
// 	if (err) throw err;
// 	console.log(auto.tables);
// 	console.log(auto.foreignKeys);
// })

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
	host: process.env.DATABASE_HOST,
	dialect: 'mysql',
	define: {
		timestamps: false,
		freezeTableName: true
    }
})

AdminBro.registerAdapter(AdminBroSequelize);
// Set up Express
const app = express();

const db = require('./models');

// RBAC functions
const canEditUser = ({ currentAdmin }) => {
	console.log(currentAdmin);
	return currentAdmin && currentAdmin.Role_Id === 1
}

// AdminBro tables and their settings
const adminBro = new AdminBro({
	resources: [
		{ resource: db.User, options: { parent: sidebarGroups.developer}}, 
		{ resource: db.Role, options: { parent: sidebarGroups.developer}},
		{ resource: db.ContentCycle, options: { parent: sidebarGroups.admin}},
		{ resource: db.Group, options: { parent: sidebarGroups.admin}},
		{ resource: db.GroupRole, options: { parent: sidebarGroups.developer}},
		{ resource: db.Journal, options: { parent: sidebarGroups.developer}},
		{ resource: db.Message, options: { parent: sidebarGroups.developer}},
		{ resource: db.Notification, options: { parent: sidebarGroups.developer}},
		{ resource: db.Notification_Type, options: { parent: sidebarGroups.developer}},
		{ resource: db.Plan, options: { parent: sidebarGroups.admin}},
		{ resource: db.Prayer_has_Tag, options: { parent: sidebarGroups.developer}},
		{ resource: db.PrayerRequest, options: {parent: sidebarGroups.developer}},
		{ resource: db.Section_has_Tag, options: { parent: sidebarGroups.admin}},
		{ resource: db.Section, options: { parent: sidebarGroups.admin}},
		{ resource: db.Tag, options: { parent: sidebarGroups.admin}},
		{ resource: db.User_has_Group, options: { parent: sidebarGroups.developer}},
		{ resource: db.User_has_Plan, options: { parent: sidebarGroups.developer}}
	],
	rootPath: '/admin'
})

// Adminbro login authentication
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
	authenticate: async (email, password) => {
	  const user = new String(await UsersService.findUserByEmail(email));
	  if (user) {
		const userPassword = await UsersService.getPasswordFromEmail(email);
		const matched = await UsersService.checkPassword(password, userPassword);
		const userRoleID = await UsersService.getUserRoleId(email);
		if (matched && (userRoleID == 1 || userRoleID == 3)) {
		  return user
		}
	  }
	  return false
	},
	cookiePassword: 'adM3mYETRmLw7r2B7FPr66',
  })


app.use(adminBro.options.rootPath, router)
app.listen(8080, () => console.log('AdminBro is under localhost:8080/admin'))
const app2 = express();
app2.use(logger('dev'));
app2.use(bodyParser.json());
app2.use(methodOverride());
app2.use(cors());

// Insert the routes under the /api url
app2.use('/api', routes)

if (process.env.PRODUCTION === 'TRUE') {
	https.createServer({
		key: fs.readFileSync(process.env.SERVER_KEY_FILE),
		cert: fs.readFileSync(process.env.SERVER_CERT_FILE)
	}, app2)
		.listen(process.env.PORT, function () {
			console.log(`API listening on ${process.env.SERVER_URL}:${process.env.PORT} over https.`)
		})
} else {
	app2.listen(process.env.PORT);
}
