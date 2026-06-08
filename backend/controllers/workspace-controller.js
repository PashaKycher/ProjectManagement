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