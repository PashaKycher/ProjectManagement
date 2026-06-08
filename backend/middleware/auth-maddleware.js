import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddlaware = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, error: true, message: "Токен не знайдено у auth-middleware" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res.status(401).json({ success: false, error: true, message: "Користувач не знайдено у auth-middleware" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("auth-middleware:", error);
        res.status(500).json({ success: false, error: true, message: "Щось пішло не так у auth-middleware" });
    }
}

export default authMiddlaware