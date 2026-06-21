import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  action: {
    type: String,
    required: true,
    enum: [
      "created_task",
      "updated_task",
      "completed_task",
      "deleted_task",
      "created_subtask",
      "updated_subtask",
      "completed_subtask",
      "deleted_subtask",
      "created_project",
      "updated_project",
      "completed_project",
      "deleted_project",
      "created_workspace",
      "updated_workspace",
      "deleted_workspace",
      "added_comment",
      "added_member",
      "removed_member",
      "joined_workspace",
      "added_attachment",
      "transferred_workspace_ownership",
    ]
  },
  resourceType: { type: String, required: true, enum: ["Task", "Subtask", "Project", "Workspace", "Comment", "User"] },
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;