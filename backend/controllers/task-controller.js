import Project from "../models/project.js";
import Workspace from "../models/workspace.js";
import Task from "../models/taks.js";

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignees, status, priority, dueDate } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }
    
    const workspace = await Workspace.findById(project.workspace);
    if(!workspace) {
      return res.status(404).json({ success: false, error: true, message: "Робочий проcтір не знайдено", });
    }
    
    const isMember = workspace.members.some((member) => member.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
    }
    
    const newTask = await Task.create({ title, description, assignees, status, priority, dueDate, project: projectId, createBy: req.user._id });

    project.tasks.push(newTask._id);
    await project.save();

    return res.status(201).json(newTask);
  } catch (error) {
    console.error("task-controller - createTask:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у createTask", });
  }
}