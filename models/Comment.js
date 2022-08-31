const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    writtenBy: String,
    commentBody: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = model('Comment',CommentSchema);

module.exports = Comment;