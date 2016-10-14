//Imports
var Event = require('../models/models.js');
var helper = require('../config/helper');

module.exports = function(server) {
    //[GET, POST, PUT, DELETE] routes defined here

    //[GET] REQUEST TO RESTURN ALL EVENTS
    server.get('/events', function(req, res, next) {
        helper.success(res, next, "HELLO");
    });

    //[POST] REQUEST TO ADD NEW EVENTS
    server.post('/events', function(req, res, next) {
        
    })
}
