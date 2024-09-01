import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import prisma from '../prisma/client';
import { config } from '../config';
import { RegisterUserDto } from '../dtos';

export class UserService {
    async register(email: string, fullName: string, password: string) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                full_name: fullName,
                password: hashedPassword,
            },
        });

        const verificationToken = jwt.sign({ userId: user.id }, config.secret, { expiresIn: '1d' });
        const verificationLink = `${config.clientUrl}/api/auth/verify-email?token=${verificationToken}`;

        await this.sendVerificationEmail(user.email, verificationLink);

        return user;
    }

    async sendVerificationEmail(email: string, verificationLink: string) {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: config.emailUser,
                pass: config.emailPass,
            },
        });

        await transporter.sendMail({
            from: config.clientUrl,
            to: email,
            subject: 'Verify your email',
            html: `<p>Please verify your email by clicking on the following link: <a href="${verificationLink}">Verify Email</a></p>`,
        });
    }

    async verifyEmail(token: string) {
        const decoded = jwt.verify(token, config.secret) as { userId: string };
        const user = await prisma.user.update({
            where: { id: decoded.userId },
            data: { is_verified: true },
        });
        return user;
    }

    async authenticate(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        if (!user.is_verified) {
            throw new Error('Please verify your email');
        }

        const token = jwt.sign({ userId: user.id }, config.secret, { expiresIn: '8h' });
        return token;
    }

    async updateUser(userId: string, updateData: RegisterUserDto) {
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                email: updateData.email,
                full_name: updateData.full_name,
                password: updateData.password,
            }
        });

        return updatedUser;
    }
}