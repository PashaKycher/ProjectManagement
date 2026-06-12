import mongoose from "mongoose";
import { string } from "zod";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    status: { type: String, enum: ["To Do", "In Progress", "Review", "Done"], default: "ToDo", },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium", },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    watchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dueDate: { type: Date },
    completedAt: { type: Date },
    estimatedHours: { type: Number, min: 0 },
    actualHours: { type: Number, min: 0 },
    tags: [{ type: String }],
    subtasks: [{
        title: { type: String, required: true },
        complited: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    attachments: [{
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String },
        fileSize: { type: Number },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        uploadedAt: { type: Date, default: Date.now }
    }],
    createBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;