//Imports
var models = require('../models/models.js');
var helper = require('../config/helper');

//Get the events from models
var Event = models.Event;

module.exports = function(server) {
    //[GET, POST, PUT, DELETE] routes defined here

    //[GET] REQUEST TO RESTURN ALL EVENTS
    server.get('/events', function(req, res, next) {
        //Get all the events from database and return
        Event.find({}, function(err, docs) {
            //Check for error while reteriving data
            if(err) {
                //If error then return failure
                helper.failure(res, next, 'Error while getting events.', 404);
            } else {
                //Return the data
                helper.success(res, next, docs);
            }
        });
    });

    //[POST] REQUEST TO ADD NEW EVENTS
    server.post('/events', function(req, res, next) {
        //Create a new event and get the data from the request
        var newEvent = new Event({
            title : req.params.title,
            description : req.params.description,
            date : new Date(),
            venue : req.params.venue,
            requirements : req.params.requirements
        });
        newEvent.save(function(err) {
            //Check if error inserting the data
            if(err) {
                //If error then return failure;
                console.log(err);
                helper.failure(res, next, 'Error inserting data', 404);
            } else {
                //Return the event data if successful
                console.log("New event submitted");
                helper.success(res, next, newEvent);
            }
        });
    })
}
