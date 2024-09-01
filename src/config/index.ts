import dotenv from 'dotenv';

dotenv.config();

export const config = {
    secret: process.env.SECRET_KEY || "",
    dbUrl: process.env.DATABASE_URL,
    clientUrl: process.env.CLIENT_URL,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
};

