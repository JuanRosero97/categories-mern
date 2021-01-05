const mongosee = require('mongoose');
const {Schema} = mongosee;

const category_schema = new Schema({
    background: { type: String, required : true},
    name: { type: String, required : true, unique: true},
    description: { type: String, required: true,}
});

module.exports = mongosee.model('Category',category_schema)