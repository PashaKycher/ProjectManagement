import Project from "../models/project.js";
import Workspace from "../models/workspace.js";
import Task from "../models/taks.js";
import { recordActivity } from "../libs/index.js";

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

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("assignees", "name profilePicture").populate("watchers", "name profilePicture");
    if (!task) {
      return res.status(404).json({ success: false, error: true, message: "Завдання не знайдено", });
    }

    const project = await Project.findById(task.project).populate("members.user", "name profilePicture");
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }

    return res.status(200).json({task, project});
  } catch (error) {
    console.error("task-controller - getTaskById:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у getTaskById", });
  }
}

export const updateTaskTitle = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: true, message: "Завдання не знайдено", });
    }

    const oldTitle = task.title;

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }
    
    const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
    }

    task.title = title;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Змінено назву з ${oldTitle} на ${title}` });

    return res.status(200).json(task);
  } catch (error) {
    console.error("task-controller - updateTaskTitle:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у updateTaskTitle", });
  }
}

export const updateTaskDescription = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: true, message: "Завдання не знайдено", });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }
    
    const isMember = workspace.members.some((member) => member.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
    }

    const oldDiscription = task.discription.substring(0, 50) + (task.discription.length > 50 ? "..." : "");
    const newDiscription = description.substring(0, 50) + (description.length > 50 ? "..." : "");
    task.discription = description;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Змінено опис з ${oldDiscription} на ${newDiscription}` });

    return res.status(200).json(task);
  } catch (error) {
    console.error("task-controller - updateTaskTitle:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у updateTaskTitle", });
  }
}