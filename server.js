var restify = require('restify');
var server = restify.createServer();    //Create server
var setupController = require('./controllers/setup-controller');
var routes = require('./controllers/routes');

//Set up parsers on server
setupController(server, restify);

//Set routes on server
routes(server);

server.listen(8000, function(){
    console.log("Hello");
});
