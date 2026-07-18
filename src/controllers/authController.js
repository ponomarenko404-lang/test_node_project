import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from "../services/auth.js";

export const registerUser = async (req, res) => {
    const { email, name, password } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) {
        throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, name, password: hashedPassword });
    const session = createSession(user._id);

    setSessionCookies(res, session);

    res.status(201).json(user);
}
