"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.login = exports.register = void 0;
const tslib_1 = require("tslib");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const class_validator_1 = require("class-validator");
const client_1 = tslib_1.__importDefault(require("prisma/client"));
const dtos_1 = require("dtos");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const environment_conf_1 = tslib_1.__importDefault(require("config/environment.conf"));
const secretKey = (0, environment_conf_1.default)().secret || '';
const register = async (req, res) => {
    const registerDto = new dtos_1.RegisterUserDto();
    Object.assign(registerDto, req.body);
    const errors = await (0, class_validator_1.validate)(registerDto);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    const { email, full_name, password } = registerDto;
    try {
        const existingUser = await client_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await client_1.default.user.create({
            data: {
                email,
                full_name,
                password: hashedPassword,
            },
        });
        const verificationToken = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, { expiresIn: '1d' });
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Verify your email',
            html: `<p>Please verify your email by clicking on the following link: <a href="${verificationLink}">Verify Email</a></p>`,
        });
        res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const loginDto = new dtos_1.LoginUserDto();
    Object.assign(loginDto, req.body);
    const errors = await (0, class_validator_1.validate)(loginDto);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    const { email, password } = loginDto;
    try {
        const user = await client_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.is_verified) {
            return res.status(400).json({ message: 'Please verify your email' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        const user = await client_1.default.user.update({
            where: { id: decoded.userId },
            data: { is_verified: true },
        });
        res.status(200).json({ message: 'Email verified successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
exports.verifyEmail = verifyEmail;
//# sourceMappingURL=auth.controller.js.map