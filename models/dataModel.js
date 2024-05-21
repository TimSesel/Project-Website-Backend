var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var dataSchema = new Schema({
	'location' : String,
	'coordinate_x' : Number,
	'coordinate_y' : Number,
	'date' : Date,
	'decibels' : Number,
	//'scale' : String,
});

module.exports = mongoose.model('data', dataSchema);
