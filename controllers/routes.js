//Imports
var models = require('../models/models.js');
var helper = require('../config/helper');

//Get the events from models
var Event = models.Event;
var User = models.User;

module.exports = function(server) {
    //[GET, POST, PUT, DELETE] routes defined here

    //[GET] REQUEST TO RESTURN ALL EVENTS
    server.get('/api/events', function(req, res, next) {
        //Get all the events from database and return
        Event.find({"verified" : true}, null, {sort : {date : -1} }, function(err, docs) {
            //Check for error while reteriving data
            if(err) {
                //If error then return failure
                helper.failure(res, next, 'Error while getting events.', 404);
            } else {
                //Return the data
                console.log(req.connection.remoteAddress + " : Fetching events");
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
            date : req.params.event_date,
            venue : req.params.venue,
            requirements : req.params.requirements,
            verified : false,
            people_interested : 0,
            image : req.params.image,
            avatar_id : req.params.avatar_id,
            event_links : req.params.event_links,
            event_contacts : req.params.event_contacts,
            submitted_by : req.params.submitted_by
        });

        console.log(newEvent);

        newEvent.save(function(err) {
            //Check if error inserting the data
            if(err) {
                //If error then return failure;
                console.log(err);
                helper.failure(res, next, 'Error inserting data', 404);
            } else {
                //Return the event data if successful
                console.log(req.connection.remoteAddress + " : Submitted new event");
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
    server.post('/api/events/comment', function(req, res, next) {
        var comment = req.params.comment;
        var from = req.params.from;
        var time = req.params.time;
        var event_id = req.params.event_id;

        //Check if fields are not empty
        if(comment != null || from != null){
            //Reterieve particular event from database
            Event.findByIdAndUpdate(event_id, { $push : { "comments" : { "from" : from, "comment" : comment, "time" : time} } }, function(err, doc) {
                //Check if error while reteriving the database
                if(err) {
                    //Return failure if error while updatin
                    helper.failure(res, next, 'Error while adding comment', 404);
                } else {
                    //Return success on changes being made
                    console.log(req.connection.remoteAddress + " : New comment")
                    helper.success(res, next, 'Comment added successfuly');
                }
            });
        } else {
            helper.failure(res, next, 'Comment/Id cannot be empty', 404);
        }
    });

    //[POST] REQUEST TO RATE AN EVENT
    server.post('/api/events/rating/:id', function(req, res, next) {
        var rating = req.params.rating;
        var userId = req.params.user_id;
        //Check if fields are not empty
        if(rating == null || userId == null) {
            helper.failure(res, next, 'Rating/Id cannot be empty', 404);
        } else {
            //Retrieve particular event from database
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

    //[POST] REQUEST TO INCREASE/DECREASE THE NUMBER OF PEOPLE INTERESTED
    server.post('/api/events/interested/:id', function(req, res, next) {
        var increaseOrDecrease = req.params.increase_decrease;
        //Check if fields are not empty
        if(increaseOrDecrease == null) {
            helper.failure(res, next, 'Increase/Decrease should be provided', 404);
        } else {
            //Get increase or decrease
            if(increaseOrDecrease == 1) increaseOrDecrease = 1; else increaseOrDecrease = -1;
            ////Retrieve particular event from database
            Event.findByIdAndUpdate(req.params.id, { $inc : { people_interested : increaseOrDecrease } }, function(err, doc) {
                //Check if there is no error while updating document
                if(err) {
                    helper.failure(res, next, 'Error while updating event interests', 404);
                } else {
                    //Return success on changes being made
                    helper.success(res, next, 'Interested noted successfuly');
                }
            });
        }
    });

    //[POST] REQUST TO SIGNUP
    server.post('/api/signup', function(req, res, next) {
        var email = req.params.email;
        var password = req.params.password;
        var phone = req.params.phone;
        var full_name = req.params.full_name;

        User.count({'email':email}, function(err, docs){
            if(err) {
                //If error then return failure
                helper.failure(res, next, 'Error in request', 404);
            } else {
                //User already exists
                if(docs) {
                    helper.failure(res, next, 'Email already exists', 200);
                } else {
                    //Sign up the user
                    var user = new User({
                        email : req.params.email,
                        password : req.params.password,
                        phone : req.params.phone,
                        full_name : full_name,
                        type : "user"
                    });

                    user.save(function(err){
                        //if error notify
                        if(err) {
                            helper.failure(res, next, 'Unable to signup', 404);
                        } else {
                            helper.success(res, next, 'Signed up successfuly');
                        }
                    });
                }
            }
        });
    });

    //[POST] REQUEST TO LOGIN
    server.post('/api/login', function(req, res, next){
        var email = req.params.email;
        var password = req.params.password;
        console.log(req.connection.remoteAddress + " : Login request" );

        User.count({'email':email}, function(err, docs){
            if(err) {
                //Return error
                helper.failure(res, next, 'Error in request', 404);
            } else {
                //User already exists check for credentials
                if(docs) {
                    //If user exists check for password
                    User.find({'email':email}, function(err, docs){
                        //Match password
                        if(docs[0].password == password) {
                            helper.success(res, next, docs);
                            console.log(docs)
                        } else {
                            helper.failure(res, next, 'Wrong username/password', 200);
                        }
                    });
                } else {
                    helper.failure(res, next, 'Wrong username/password', 200);
                }
            }
        });
    })

    //[POST] REQUEST FOR GETTING SUBMITTED EVENTS
    server.post('/api/submitted-events', function(req, res, next) {
        //Get all the events from database and return
        var submitted_by = req.params.submitted_by;
        Event.find({"submitted_by" : submitted_by}, null, {sort : {date : -1} }, function(err, docs) {
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

    //[PUT] REQUEST TO UPDATE THE USER INFORMATION
    server.put('/api/user/update', function(req, res, next){
        var email = req.params.email;
        var password = req.params.password;
        var full_name = req.params.full_name;
        var phone = req.params.phone;
        var old_password = req.params.old_password;

        //Create new user
        var user = new User({
            email : email,
            password : password,
            full_name : full_name,
            phone : phone
        });

        console.log(old_password);

        //Check if email and password match
        User.count({'email':email}, function(err, docs){
            if(err) {
                //Return error
                helper.failure(res, next, 'Error in request', 404);
            } else {
                //User already exists check for credentials
                if(docs) {
                    //If user exists check for password
                    User.find({'email':email}, function(err, docs){
                        //Match password
                        if(docs[0].password == old_password) {
                            //Update document
                            User.update({"email" : email}, {"$set":{"email":email,"phone":phone,"full_name":full_name,"password":password}}, {upsert : false}, function(err, docs) {
                                //Check for error while updating
                                if(err) {
                                    console.log(err);
                                    //If error then return failure
                                    helper.failure(res, next, 'Error while updating account', 200);
                                } else {
                                    helper.success(res, next, docs);
                                }
                            })
                            console.log(docs)
                        }    else {
                            helper.failure(res, next, 'Wrong username/password', 200);
                        }
                    });
                } else {
                    helper.failure(res, next, 'Wrong username/password', 200);
                }
            }
        });
    });

    //[PUT] REQUEST TO VERIFY THE EVENT
    server.put('/api/event/verify', function(req, res, next){
        var event_id = req.params.event_id;
        var verify = req.params.is_verified;

        Event.findOne({ _id : event_id}, function(err, doc) {
            //Check if there is no error while updating document
            if(err) {
                helper.failure(res, next, 'Error while verifying event', 404);
            } else {
                doc.verified = verify;
                doc.save();
                //Return success on changes being made
                helper.success(res, next, 'Successfuly verified event');
                console.log(doc)
            }
        });
    });

    //[GET] REQUEST TO RESTURN ALL EVENTS THAT ARE NOT VERIFIED
    server.get('/api/unverified-events', function(req, res, next) {
        //Get all the events from database and return
        Event.find({"verified" : false}, null, {sort : {date : -1} }, function(err, docs) {
            //Check for error while reteriving data
            if(err) {
                //If error then return failure
                console.log(err);
                helper.failure(res, next, 'Error while getting events.', 404);
            } else {
                //Return the data
                console.log(req.connection.remoteAddress + " : Fetching unverified events");
                helper.success(res, next, docs);
            }
        });
    });

    //[DELETE] REQUEST TO DELETE AN EVENT
    server.del('/api/event/:id', function(req, res, next) {
        var event_id = req.params.id;
        console.log(event_id);

        Event.remove({ _id : event_id }, function(err, docs) {
            if(err) {
                helper.failure(res, next, 'Error while deleteing event', 404);
            } else {
                helper.success(res, next, docs);
            }
        });
    });
}
