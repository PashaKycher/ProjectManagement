export enum ProjectStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "In Progress",
  ON_HOLD = "On Hold",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum TaskStatus {
  TO_DO = "To Do",
  IN_PROGRESS = "In Progress",
  REVIEW = "Review",
  DONE = "Done",
}

export enum PriorityStatus {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum RoleStatus {
  OWNER = "Owner",
  ADMIN = "Admin",
  MEMBER = "Member",
  VIEWER = "Viewer",
}

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  isEmailVerified: boolean;
  updateAt: Date;
  profilePicture?: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: User | string;
  color: string;
  members: {
    user: User;
    role: RoleStatus;
    joined: Date;
  }[];
  createdAt: Date;
  updateAt: Date;
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  workspace: Workspace;
  startDate: Date;
  dueDate: Date;
  progress: number;
  tasks: Task[];
  members: {
    user: User;
    role: RoleStatus;
    joinedAt: Date;
  }[];
  isArchived: boolean;
  createdAt: Date;
  updateAt: Date;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project: Project;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  dueDate: Date;
  priority: PriorityStatus;
  assignee: User | string;
  createdBy: User | string;
  assignees: User[];
  subtasks: Subtask[];
  watchers?: User[];
  attachments?: Attachment[];
}

export interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Attachment {
  _id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Member {
  _id: string;
  user: User;
  role: RoleStatus;
  joinedAt: Date;
}

export type ResourceType =
  | "Task"
  | "Project"
  | "Workspace"
  | "Comment"
  | "User";

export type ActionType =
  | "created_task"
  | "updated_task"
  | "completed_task"
  | "deleted_task"
  | "created_subtask"
  | "updated_subtask"
  | "completed_subtask"
  | "deleted_subtask"
  | "created_project"
  | "updated_project"
  | "completed_project"
  | "deleted_project"
  | "created_workspace"
  | "updated_workspace"
  | "deleted_workspace"
  | "added_comment"
  | "added_member"
  | "removed_member"
  | "joined_workspace"
  | "added_attachment"
  | "transferred_workspace_ownership";

export interface ActivityLog {
  _id: string;
  user: User;
  action: ActionType;
  resourceType: ResourceType;
  resourceId: string;
  details: any;
  createdAt: Date;
}

export interface CommentReaction {
  user: User;
  emoji: string;
  createdAt: Date;
}

export interface Comment {
  _id: string;
  text: string;
  author: User;
  createdAt: Date;
  reactions?: CommentReaction[];
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];
}
