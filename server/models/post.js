const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pasteSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    listed: {
        type: Boolean,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    paste: {
        type: String,
    },
    lang: {
        type: String,
    },
    stars: {
        type: Number,
        default: 0,
    },
    starsUsers: [{
        type: Schema.Types.ObjectId,
    }, ],
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', pasteSchema);

module.exports = Post;