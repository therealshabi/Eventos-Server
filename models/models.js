//Get mongoose package and reterieve Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Event Schema
var eventSchema = new Schema({
    title : String,
    description : String,
    date : Date,
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
    event_links : []
});

var Event = mongoose.model('events', eventSchema);

module.exports = {
    Event: Event
};
