var restify = require('restify');
var server = restify.createServer();    //Create server
var setupController = require('./controllers/setup-controller');
var routes = require('./controllers/routes');
var mongoose = require('mongoose');
var mongooseConnection = require('./config/mongoose-connection');

//Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(mongooseConnection.getMongoConnection());

//Set up parsers on server
setupController(server, restify);

//Set routes on server
routes(server);

server.listen(8080, '192.168.43.56', function(){
    console.log("Hello");
});
