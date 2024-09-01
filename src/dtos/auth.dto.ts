import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterUserDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email!: string;

    @IsString()
    @MinLength(5, { message: 'Full name must be at least 5 characters long' })
    @MaxLength(1000, { message: 'Full name must not exceed 1000 characters' })
    @Matches(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, { message: 'Full name can only contain Latin or Cyrillic letters' })
    full_name!: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password!: string;
    id: any;
}

export class LoginUserDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email!: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password!: string;
}