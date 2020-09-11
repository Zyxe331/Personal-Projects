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

// Set up Express
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

// Insert the routes under the /api url
app.use('/api', routes)

// Listen on port specified in env
//app.listen(3000);

if (process.env.PRODUCTION === 'TRUE') {
	https.createServer({
		key: fs.readFileSync(process.env.SERVER_KEY_FILE),
		cert: fs.readFileSync(process.env.SERVER_CERT_FILE)
	}, app)
		.listen(process.env.PORT, function () {
			console.log(`API listening on ${process.env.SERVER_URL}:${process.env.PORT} over https.`)
		})
} else {
	app.listen(process.env.PORT);
}
