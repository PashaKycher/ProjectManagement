import User from "../models/user.js";
import bcrypt from 'bcrypt';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({success: false, error:true, message: 'Користувач з таким email вже існує' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({success: true, error: false, message: 'Лист для варифікації надіслано на ваш email. Будь ласка, перевірте свою пошту' });

        // TODO: Send verification email 
    } catch (error) {
        console.error("auth-controller - registerUser: ", error);
        res.status(500).json({success: false, error:true, message: 'Щось пішло не так' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success: false, error:true, message: 'Невірний email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({success: false, error:true, message: 'Невірний пароль' });
        }
        res.status(200).json({success: true, error: false, message: 'Вхід успішний' });
    } catch (error) {
        console.error("auth-controller - loginUser: ", error);
        res.status(500).json({success: false, error:true, message: 'Щось пішло не так' });
    }
};

export { registerUser, loginUser };