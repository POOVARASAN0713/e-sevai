const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    email: {
        type: String,
        default: 'Not provided',
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    service: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;