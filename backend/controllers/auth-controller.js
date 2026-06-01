import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";

const verificationCreate = async (id, email) => {
    const verificationToken = jwt.sign({ userId: id, purpose: "email-verification", }, process.env.JWT_SECRET, { expiresIn: "1h", });
    await Verification.create({ userId: id, token: verificationToken, expiresAt: new Date(Date.now() + 60 * 60 * 1000), });
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailBody = `
        Будь ласка, натисніть на посилання нижче, щоб підтвердити свою електронну адресу:
        <a href="${verificationLink}">${verificationLink}</a>

        Якщо ви не реєструвалися на нашому сайті, просто ігноруйте цей лист.
    `;
    const emailSubject = "Підтвердження електронної адреси";
    const emailSent = await sendEmail(email, emailSubject, emailBody);
    if (!emailSent) {
        throw new Error("Не вдалося надіслати лист");
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Перевірка email через Arcjet
        const decision = await aj.protect(req, { email });
        console.log("Arcjet decision:", decision.isDenied());

        if (decision.isDenied()) {
            return res.status(403).json({ success: false, error: true, message: "Не вірний email", });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, error: true, message: "Користувач з таким email вже існує", });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        await verificationCreate(user._id, email);

        return res.status(201).json({ success: true, error: false, message: "Лист для верифікації надіслано на ваш email. Будь ласка, перевірте свою пошту", });
    } catch (error) {
        console.error("auth-controller - registerUser:", error);
        return res.status(500).json({ success: false, error: true, message: "Щось пішло не так", });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ success: false, error: true, message: "Невірний email", });
        }

        const validationEmail = user.isEmailVerified;
        if (!validationEmail) {
            const existingVerification = await Verification.findOne({ userId: user._id });
            if (existingVerification) {
                if (existingVerification.expiresAt > new Date()) {
                    return res.status(400).json({ success: false, error: true, message: "Будь ласка, підтвердіть свою електронну адресу. Лист для верифікації вже надіслано", });
                } else {
                    await Verification.findByIdAndDelete(existingVerification._id);
                    await verificationCreate(user._id, user.email);
                    return res.status(400).json({ success: false, error: true, message: "Будь ласка, підтвердіть свою електронну адресу. Лист для верифікації надіслано повторно", });
                }
            } else {
                await verificationCreate(user._id, user.email);
                return res.status(400).json({ success: false, error: true, message: "Будь ласка, підтвердіть свою електронну адресу. Лист для верифікації надіслано повторно", });
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: true, message: "Невірний пароль" });
        }

        user.lastLogin = new Date();
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d", });
        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({ success: true, error: false, message: "Вхід успішний", token, user: userData });
    } catch (error) {
        console.error("auth-controller - loginUser:", error);
        return res.status(500).json({ success: false, error: true, message: "Щось пішло не так", });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(400).json({ success: false, error: true, message: "Немає токенa", });
        }

        const { userId, purpose } = decodedToken;
        if (purpose !== "email-verification") {
            return res.status(400).json({ success: false, error: true, message: "Невірне значення ключа 'purpose'", });
        }

        const verificationRecord = await Verification.findOne({ userId, token });
        if (!verificationRecord) {
            return res.status(400).json({ success: false, error: true, message: "Немає заявки підтвердження", });
        }

        const isTokenExpired = verificationRecord.expiresAt < new Date();
        if (isTokenExpired) {
            return res.status(400).json({ success: false, error: true, message: "Токен верифікації закінчився", });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, error: true, message: "Користувача не знайдено", });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, error: true, message: "Email вже підтверджено", });
        }

        user.isEmailVerified = true;
        await user.save();

        await Verification.findByIdAndDelete(verificationRecord._id);

        return res.status(200).json({ success: true, error: false, message: "Email підтверджено", });
    } catch (error) {
        console.error("auth-controller - verifyEmail:", error);
        return res.status(500).json({ success: false, error: true, message: "Щось пішло не так", });
    }
};

export { registerUser, loginUser, verifyEmail };