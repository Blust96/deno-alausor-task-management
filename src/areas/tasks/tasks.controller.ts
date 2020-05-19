import { Controller, Get, Post, Delete, Patch, Body, Param, QueryParam, BadRequestError } from 'https://deno.land/x/alosaur/src/mod.ts';
import validator from 'https://dev.jspm.io/class-validator@0.8.5';

import { TasksService } from './tasks.service.ts';
import { Task, TaskStatus } from './task.model.ts';
import { CreateTaskDto } from './dto/create-task.dto.ts';

const { validate } = validator;

@Controller()
export class TasksController {

    constructor(private tasksService: TasksService) {}

    @Get()
    getAllTasks(
        @QueryParam('search') search: string,
        @QueryParam('status') status: string
    ): Task[] {
        getTasksValidation(search, status);
        return this.tasksService.getAllTasks(search, status.toUpperCase());
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    async createTask(@Body(CreateTaskDto) createTaskDto: CreateTaskDto): Promise<Task> {
        const errors = await validate(createTaskDto);

        if (errors.length > 0) {
            throw new BadRequestError(`Invalid parameters: ${errors.map(error => error.property)} are empty.`);
        }

        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): void {
        this.tasksService.deleteTask(id);
    }

    @Patch('/:id')
    async updateTaskStatus(
        @Param('id') id: string,
        @Body() body: any
    ): Promise<Task> {
        const { status } = body;
        statusValidation(status);
        return this.tasksService.updateTaskStatus(id, status.toUpperCase());
    }

}

//TODO: Move validation checking in body or query pipe validation 🔥

function statusValidation(status: string): void {
    if (!status) {
        throw new BadRequestError(`Status should not be empty.`);
    }

    if (!(status.toUpperCase() in TaskStatus)) {
        throw new BadRequestError(`Status must be one of the following values ${Object.values(TaskStatus).map(status => `'${status}'`)}.`);
    }
}

function getTasksValidation(search: string, status: string): void {
    let errors: string[] = [];

    if (search && search === '') {
        errors.push(' search should not be empty');
    }

    if (status && status === '') {
        errors.push(' status should not be empty');
    } else if (status && !(status.toUpperCase() in TaskStatus)) {
        errors.push(` status must be one of the following: ${Object.values(TaskStatus).map(status => `'${status}'`)}.`);
    }

    if (errors.length > 0) {
        throw new BadRequestError(`Invalid parameters:${errors.map(error => `${error}`)}`);
    }
}