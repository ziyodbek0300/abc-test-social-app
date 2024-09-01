import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePublicationDto {
    @IsString()
    @Length(5, 100)
    title: string;

    @IsString()
    @Length(10, 10000)
    content: string;
}

export class UpdatePublicationDto {
    @IsOptional()
    @IsString()
    @Length(5, 100)
    title?: string;

    @IsOptional()
    @IsString()
    @Length(10, 5000)
    content?: string;
}

export class FilterPublicationsDto {
    @IsOptional()
    @IsString()
    authorId?: string;

    @IsOptional()
    @IsString()
    keyword?: string;
}