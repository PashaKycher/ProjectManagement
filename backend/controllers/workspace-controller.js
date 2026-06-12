import Project from "../models/project.js";
import Workspace from "../models/workspace.js";

export const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({ "members.user": req.user._id, }).sort({ createdAt: -1 });

        res.status(200).json(workspaces);
    } catch (error) {
        console.log("workspace-controller - getWorkspaces", error);
        return res.status(500).json({ message: "Internal server error", error: true, success: false });
    }
};

export const createWorkspace = async (req, res) => {
    try {
        const { name, description, color } = req.body;

        const workspace = await Workspace.create({
            name,
            description,
            color,
            owner: req.user._id,
            members: [{ user: req.user._id, role: "owner", joined: Date.now() }]
        });

        return res.status(201).json({ success: true, error: false, message: "Робочий проект створено", workspace });
    } catch (error) {
        console.error("workspace-controller - createWorkspace:", error);
        return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у createWorkspace", });
    }
}

export const getWorkspaceById = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await Workspace.findOne({ _id: workspaceId, "members.user": req.user._id, }).populate("members.user", "name email profilePicture");
        if (!workspace) {
            return res.status(404).json({ success: false, error: true, message: "Робочий проект не знайдено, чи ви не маєте доступу. Зверніться до адміністратора!", });
        }

        return res.status(200).json(workspace);
    } catch (error) {
        console.error("workspace-controller - getWorkspaceById:", error);
        return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у getWorkspaceById", });
    }
}

export const getWorkspaceByIdProjects = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await Workspace.findOne({ _id: workspaceId, "members.user": req.user._id, }).populate("members.user", "name email profilePicture");
        if (!workspace) {
            return res.status(404).json({ success: false, error: true, message: "Робочий проект не знайдено, чи ви не маєте доступу. Зверніться до адміністратора!", });
        }

        const projects = await Project.find({ workspace: workspaceId, isArchived: false, members: { $in: req.user._id }, })
            .populate("tasks", "status")
            .sort({ createdAt: -1 });

        return res.status(200).json({ projects, workspace });
    } catch (error) {
        console.error("workspace-controller - getWorkspaceByIdProjects:", error);
        return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у getWorkspaceByIdProjects", });
    }
}