var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var dataSchema = new Schema({
    'info': { type: String, required: true },
});

module.exports = mongoose.model('data', dataSchema);
