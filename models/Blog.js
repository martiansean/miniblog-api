const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BlogSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

mongoose.model('blogs', BlogSchema);
