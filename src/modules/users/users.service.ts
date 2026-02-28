import bcrypt from "bcryptjs";
import { signToken } from "../../config/jwt.ts";
import { AppError } from "../../web/errors/AppError.ts";
import { createUser, findUserByEmail } from "./users.repository.ts";

const SALT_ROUNDS = 10;

export async function registerUser(data: { name: string; email: string; password: string }) {
    const existing = await findUserByEmail(data.email);
    if (existing) {
        throw new AppError(409, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await createUser({ ...data, password: hashedPassword });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function loginUser(data: { email: string; password: string }) {
    const user = await findUserByEmail(data.email);
    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
        throw new AppError(401, "Invalid credentials");
    }

    const token = signToken({ sub: user.id });

    return { token };
}


