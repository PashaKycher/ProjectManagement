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

export enum Priority {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
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
        role: "admin" | "member" | "owner" | "viewer";
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
        role: "admin" | "member" | "owner" | "viewer";
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
    priority: Priority;
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
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
}