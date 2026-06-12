import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    task: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Task' },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    mentions: [{
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        offset: { type: Number },
        length: { type: Number },
    }],
    reactions: [{
        emoji: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    }],
    attachments: [{
        fileName: { type: String },
        fileUrl: { type: String },
        fileType: { type: String },
        fileSize: { type: Number },
    }],
    isEditer: { type: Boolean, default: false },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;