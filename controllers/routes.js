//Imports
var models = require('../models/models.js');
var helper = require('../config/helper');

//Get the events from models
var Event = models.Event;

module.exports = function(server) {
    //[GET, POST, PUT, DELETE] routes defined here

    //[GET] REQUEST TO RESTURN ALL EVENTS
    server.get('/api/events', function(req, res, next) {
        //Get all the events from database and return
        Event.find({}, function(err, docs) {
            //Check for error while reteriving data
            if(err) {
                //If error then return failure
                helper.failure(res, next, 'Error while getting events.', 404);
            } else {
                //Return the data
                console.log("Serving events request to : " + req.connection.remoteAddress);
                helper.success(res, next, docs);
            }
        });
    });

    //[POST] REQUEST TO ADD NEW EVENTS
    server.post('/api/events', function(req, res, next) {
        //Create a new event and get the data from the request
        var newEvent = new Event({
            title : req.params.title,
            description : req.params.description,
            date : new Date(),
            venue : req.params.venue,
            requirements : req.params.requirements,
            verified : false
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
    });

    //[GET] REQUEST TO GET DATA FOR A PARTICULAR EVENT
    server.get('/api/events/:id', function(req, res, next){
        //GET data of a particular event
        Event.findById(req.params.id, function(err, doc) {
            //Check if error while reteriving the data
            if(err) {
                //If error then return failure
                console.log(err);
                helper.failure(res, next, 'Error while reteriving data', 404);
            } else {
                //Check if event exists
                if(doc === null) {
                    //Return failure if event not found
                    helper.failure(res, next, 'No event with specified id.', 404);
                } else {
                    //Return the event
                    helper.success(res, next, doc);
                }
            }
        })
    });

    //[POST] REQUEST TO POST A NEW COMMENT
    server.post('/api/events/comment/:id', function(req, res, next) {
        var comment = req.params.comment;
        var userId = req.params.user_id;
        //Check if fields are not empty
        if(comment == null || userId == null){
            helper.failure(res, next, 'Comment/Id cannot be empty', 404);
        } else {
            //Reterieve particular event from database
            Event.findByIdAndUpdate(req.params.id, { $push : { "comments" : { "user_id" : userId, "comment" : comment} } }, function(err, doc) {
                //Check if error while reteriving the database
                if(err) {
                    //Return failure if error while updatin
                    helper.failure(res, next, 'Error while adding comment', 404);
                } else {
                    //Return success on changes being made
                    helper.success(res, next, 'Comment added successfuly');
                }
            });
        }
    });

    //[POST] REQUEST TO RATE AND EVENT
    server.post('/api/events/rating/:id', function(req, res, next) {
        var rating = req.params.rating;
        var userId = req.params.user_id;
        //Check if fields are not empty
        if(rating == null || userId == null) {
            helper.failure(res, next, 'Rating/Id cannot be empty', 404);
        } else {
            //Reterieve particular event from database
            Event.findByIdAndUpdate(req.params.id, { $push : { "rating" : { "user_id" : userId, "rating" : rating} } }, function(err, doc) {
                //Check if error while reteriving the database
                if(err) {
                    //Return failure if error while updatin
                    helper.failure(res, next, 'Error while rating event.', 404);
                } else {
                    //Return success on changes being made
                    helper.success(res, next, 'Event rated successfuly');
                }
            });
        }
    });
}
