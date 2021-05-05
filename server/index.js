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
const mysql = require("mysql");
const Json2csvParser = require("json2csv").Parser;
const fastcsv = require("fast-csv");
const fs = require('fs');
const prompt = require('prompt');
const http = require('http');
var https = require('https');
var formidable = require('formidable');
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

const connection = mysql.createPool({
	host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

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
const { response } = require('express');

// RBAC functions
const canEditUser = ({ currentAdmin }) => {
	console.log(currentAdmin);
	return currentAdmin && currentAdmin.Role_Id === 1
}

// AdminBro tables and their settings
const adminBro = new AdminBro({
	resources: [
		{ resource: db.User, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				},
				import: {
					actionType: 'resource',
					icon: "Download",
					isVisible: true,
					component: AdminBro.bundle('./importFromCSV'),
					handler: async(request, response, data) => {},
				}
			},
		}},
		{ resource: db.Role, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.ContentCycle, options: { 
			parent: sidebarGroups.admin,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.Group, options: { 
			parent: sidebarGroups.admin,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.GroupRole, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.Journal, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.Message, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.Notification, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.Notification_Type, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.Plan, options: { 
			parent: sidebarGroups.admin,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.Prayer_has_Tag, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.PrayerRequest, options: {
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.Section_has_Tag, options: { 
			parent: sidebarGroups.admin,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.Section, options: { 
			parent: sidebarGroups.admin,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.Tag, options: { 
			parent: sidebarGroups.admin,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.User_has_Group, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},
		{ resource: db.User_has_Plan, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}}
	],
	rootPath: '/admin',
	branding: {
		companyName: "VitaPrayer",
		softwareBrothers: false
	}
})

function exportToCSV(response, data) {
	const table = data.resource.SequelizeModel.name;
	const ws = fs.createWriteStream(table + '.csv');
	connection.query('SELECT * FROM ' + table, function(error, data, fields) {
		if (error) throw error;
	
		const jsonData = JSON.parse(JSON.stringify(data));
		const json2csvParser = new Json2csvParser({ header: true});
		const csv = json2csvParser.parse(jsonData);

		fs.writeFile(table + ".csv", csv, function(error) {
		if (error) throw error;
		console.log("Success!");
		});
		response.attachment(table + '.csv');
		response.status(200).send(csv);
	});
}

// Adminbro login authentication
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
	authenticate: async (email, password) => {
	  const user = new String(await UsersService.findUserByEmail(email));
	  if (user) {
		const userPassword = await UsersService.getPasswordFromEmail(email);
		const matched = await UsersService.checkPassword(password, userPassword);
		const userRoleID = await UsersService.getUserRoleId(email);
		if (matched && (userRoleID == 1 || userRoleID == 3)) {
		  return user;
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
