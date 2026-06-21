import ActivityLog from "../models/activity.js";

const recordActivity = async ( userId, action, resourceType, resourceId, details) => {
  try {
    await ActivityLog.create({ userId, action, resourceType, resourceId, details });
  } catch (error) {
    console.error("activity-index - recordActivity:", error);
    return res.status(500).json({ success: false, error: true, message: "Щось пішло не так у recordActivity", });
  }
}

export { recordActivity };