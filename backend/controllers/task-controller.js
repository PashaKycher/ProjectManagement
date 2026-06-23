import Project from "../models/project.js";
import Workspace from "../models/workspace.js";
import Task from "../models/taks.js";
import { recordActivity } from "../libs/index.js";
import ActivityLog from "../models/activity.js";

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignees, status, priority, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }

    const workspace = await Workspace.findById(project.workspace);
    if (!workspace) {
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

    return res.status(200).json({ task, project });
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

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }

    const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
    }

    const oldTitle = task.title;
    task.title = title;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Змінено назву з ${oldTitle} на ${title}` });

    return res.status(200).json(task);
  } catch (error) {
    console.error("task-controller - updateTaskTitle:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у updateTaskTitle", });
  }
}

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: true, message: "Завдання не знайдено", });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }

    const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
    }

    const oldStatus = task.status;
    task.status = status;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Змінено статус з ${oldStatus} на ${status}` });

    return res.status(200).json(task);
  } catch (error) {
    console.error("task-controller - updateTaskStatus:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у updateTaskStatus", });
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

    const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
    }

    const oldDescription = task.description.substring(0, 50) + (task.description.length > 50 ? "..." : "");
    const newDescription = description.substring(0, 50) + (description.length > 50 ? "..." : "");
    task.description = description;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Змінено опис з ${oldDescription} на ${newDescription}` });

    return res.status(200).json(task);
  } catch (error) {
    console.error("task-controller - updateTaskTitle:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у updateTaskDescription", });
  }
}

export const updateTaskAssignees = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignees } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: true, message: "Завдання не знайдено", });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }

    const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
    }

    const oldAssignees = task.assignees;
    task.assignees = assignees;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Змінено учасників з ${oldAssignees.length} на ${assignees.length}` });

    return res.status(200).json(task);
  } catch (error) {
    console.error("task-controller - updateTaskAssignees:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у updateTaskAssignees", });
  }
}

export const updateTaskPriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { priority } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: true, message: "Завдання не знайдено", });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }

    const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
    }

    const oldPriority = task.priority;
    task.priority = priority;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, { description: `Змінено пріоритет з ${oldPriority} на ${priority}` });

    return res.status(200).json(task);
  } catch (error) {
    console.error("task-controller - updateTaskPriority:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у updateTaskPriority", });
  }
}

export const createSubTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: true, message: "Завдання не знайдено", });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }

    const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
    }

    const newSubTask = { title, createBy: req.user._id, complited: false };
    task.subtasks.push(newSubTask);
    await task.save();

    await recordActivity(req.user._id, "created_subtask", "Task", taskId, { description: `${req.user.name} додав підзавдання ${title}` });

    return res.status(200).json(task);
  } catch (error) {
    console.error("task-controller - createSubTask:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у createSubTask", });
  }
}

export const updateSubTask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { completed } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: true, message: "Завдання не знайдено", });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ success: false, error: true, message: "Проект не знайдено", });
    }

    const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, error: true, message: "Ви не маєте доступу до цього робочого проекту", });
    }

    const subTask = task.subtasks.find((subTask) => subTask._id.toString() === subTaskId);
    if (!subTask) {
      return res.status(404).json({ success: false, error: true, message: "Підзавдання не знайдено", });
    }

    subTask.completed = completed;
    await task.save();

    await recordActivity(req.user._id, "updated_subtask", "Task", taskId, { description: `${req.user.name} оновив підзавдання ${subTask.title}` });

    return res.status(200).json(task);
  } catch (error) {
    console.error("task-controller - updateSubTask:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у updateSubTask", });
  }
}

export const getTaskActivity = async (req, res) => {
  try {
    const { resourceId } = req.params;
console.log(resourceId);
    const activity = await ActivityLog.find({ resourceId }).populate("userId", "name profilePicture").sort({ createdAt: -1 }).limit(5);
    return res.status(200).json(activity);
  } catch (error) {
    console.error("task-controller - getTaskActivity:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у getTaskActivity", });
  }
}