//Get mongoose package and reterieve Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Event Schema
var eventSchema = new Schema({
    title : String,
    description : String,
    date : Date,
    venue : String,
    requirements : [],
    verified : String
});

var Event = mongoose.model('events', eventSchema);

module.exports = {
    Event: Event
};
