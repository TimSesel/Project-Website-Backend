var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var dataSchema = new Schema({
	'location' : String,
	'coordinate_x' : String,
	'coordinate_y' : String,
	'date' : Date,
	'decibels' : String,
	//'scale' : String,
});

module.exports = mongoose.model('data', dataSchema);
