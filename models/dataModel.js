var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var dataSchema = new Schema({
    // 'location': String,
    'latitude': { type: Number, required: true },
    'longitude': { type: Number, required: true },
	'date' : { type: Date, default: Date.now },
    'decibels': { type: Number, required: true },
	'userId': { type: Schema.Types.ObjectId, ref: 'user', required: true },
});

module.exports = mongoose.model('data', dataSchema);
