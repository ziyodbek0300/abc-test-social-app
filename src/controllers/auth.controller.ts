import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { LoginUserDto, RegisterUserDto } from '../dtos';
import { UserService } from '../services';

const userService = new UserService();

export const register = async (req: Request, res: Response) => {
    const registerDto = new RegisterUserDto();
    Object.assign(registerDto, req.body);

    const errors = await validate(registerDto);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const user = await userService.register(registerDto.email, registerDto.full_name, registerDto.password);
        res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};


export const login = async (req: Request, res: Response) => {
    const loginDto = new LoginUserDto();
    Object.assign(loginDto, req.body);

    const errors = await validate(loginDto);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const token = await userService.authenticate(loginDto.email, loginDto.password);
        res.status(200).json({ token });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};


export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    try {
        await userService.verifyEmail(token as string);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
