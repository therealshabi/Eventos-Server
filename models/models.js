//Get mongoose package and reterieve Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Event Schema
var eventSchema = new Schema({
    title : String,
    description : String,
    date : Number,
    venue : String,
    requirements : String,
    verified : Boolean,
    comments : [],
    rating : [],
    avatar_id : Number,
    event_contacts : [],
    people_interested : Number,
    image : String,
    attendies : [],
    event_links : [],
    submitted_by : String
});

var userSchema = new Schema({
    email : String,
    password : String,
    phone : String,
    full_name : String,
    type : String
});

var Event = mongoose.model('events', eventSchema);
var User = mongoose.model('user', userSchema);

module.exports = {
    Event: Event,
    User : User
};
