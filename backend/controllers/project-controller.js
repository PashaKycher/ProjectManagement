import Workspace from "../models/workspace.js";
import Project from "../models/project.js";

export const createProject = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { title, description, status, startDate, dueDate, tags, members } = req.body;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ success: false, error: true, message: "Робочий проект не знайдено. Зверніться до адміністратора!", });
        }

        const isMember = workspace.members.some((member) => member.user.toString() === req.user._id.toString());
        if (!isMember) {
            return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
        }

        const tagsArray = tags ? tags.split(",") : [];

        const newProject = await Project.create({ title, description, status, startDate, dueDate, tags: tagsArray, members, workspace: workspaceId, createBy: req.user._id });

        workspace.projects.push(newProject._id);
        await workspace.save();

        return res.status(201).json(newProject);
    } catch (error) {
        console.error("project-controller - createProject:", error);
        return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у createProject", });
    }
}