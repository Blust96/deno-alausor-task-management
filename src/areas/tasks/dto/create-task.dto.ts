import validator from 'https://dev.jspm.io/class-validator@0.8.5';

const { IsNotEmpty } = validator;

export class CreateTaskDto {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
}