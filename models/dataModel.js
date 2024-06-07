var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var dataSchema = new Schema({
    // 'location': String,
    'latitude': { type: Number, required: true },
    'longitude': { type: Number, required: true },
	'date' : { type: Date, default: Date.now },
    'decibels': { type: Number, required: true },
	'userId': { type: String, required: true },
});

module.exports = mongoose.model('data', dataSchema);
