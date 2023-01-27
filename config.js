
const stylus = require('stylus');
const cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
module.exports = async  function(app, express) {

	await mongoose.connect(process.env.DB_URL_MONGOOSE);
	console.log("mongoose connected")
	app.use(cookieParser());
	app.use(stylus.middleware({src: __dirname + '/public'}));
// express.static must come after stylus middleware & before routes //
	app.use(express.static(__dirname + '/public'));
	app.use('/api', require(__dirname + '/server/api/treatments'));
	require(__dirname + '/server/model/database')(app);
	require(__dirname + '/server/routes')(app);

}