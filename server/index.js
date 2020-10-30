const AdminBro =require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
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

// Set up environment file
dotenv.config();

//create the models in ./models
// var auto = new SequelizeAuto('vets_database', 'root', 'SQLRoot333', {
// 	host: 'localhost',
// 	port: '3306',
// 	dialect: 'mysql'
// })
// auto.run(function (err) {
// 	if (err) throw err;
// 	console.log(auto.tables);
// 	console.log(auto.foreignKeys);
// })

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
	host: 'localhost',
	dialect: 'mysql',
	define: {
		timestamps: false,
		freezeTableName: true
    }
})

AdminBro.registerAdapter(AdminBroSequelize);
const db = require('./models');
const adminBro = new AdminBro({
	databases: [db],
	rootPath: '/admin'
})

const router = AdminBroExpress.buildRouter(adminBro);

// Set up Express
const app = express();
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
