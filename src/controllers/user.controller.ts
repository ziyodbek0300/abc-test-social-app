import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { RegisterUserDto } from '../dtos';
import { UserService } from '../services';

const userService = new UserService();

export const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const updateUserDto = new RegisterUserDto();
    Object.assign(updateUserDto, req.body);

    const errors = await validate(updateUserDto);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const updatedUser = await userService.updateUser(userId, updateUserDto);
        res.status(200).json({ message: 'User details updated successfully', user: updatedUser });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};