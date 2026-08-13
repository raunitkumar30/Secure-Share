const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    storedName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    shareId: {
    type: String,
    unique: true,
    required: true
}

}, {
    timestamps: true
});

const File = mongoose.model('File', fileSchema);
module.exports = File;