const mongoose = require("mongoose");

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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shareId: {
        type: String,
        default: null
    },
    shareExpiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Enforce uniqueness only for actual share tokens.
fileSchema.index(
    { shareId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            shareId: { $type: "string" }
        }
    }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
