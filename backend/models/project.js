import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Workspace' },
  status: { type: String, enum: ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"], default: "Planning", },
  startDate: { type: Date },
  dueDate: { type: Date },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ["admin", "member", "owner", "viewer"], default: "contributor", },
    joinedAt: { type: Date, default: Date.now }
  }],
  tags: [{ type: String }],
  createBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;