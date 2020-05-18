import { Controller, Get, Post, Delete, Patch, Body, Param, BadRequestError } from 'https://deno.land/x/alosaur/src/mod.ts';
import validator from 'https://dev.jspm.io/class-validator@0.8.5';

import { TasksService } from './tasks.service.ts';
import { Task, TaskStatus } from './task.model.ts';
import { CreateTaskDto } from './dto/create-task.dto.ts';

const { validate } = validator;

@Controller()
export class TasksController {

    constructor(private tasksService: TasksService) {}

    @Get()
    getAllTasks(): Task[] {
        return this.tasksService.getAllTasks();
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

    //TODO: Move status type/value checking in body parser
    @Patch('/:id')
    async updateTaskStatus(
        @Param('id') id: string,
        @Body() body: any
    ): Promise<Task> {
        const { status } = body;

        if (!status) {
            throw new BadRequestError(`Invalid parameters: status is empty.`);
        }

        if (!(status.toUpperCase() in TaskStatus)) {
            throw new BadRequestError(`Invalid parameters: status should be ${Object.values(TaskStatus).map(status => `'${status}'`)}.`);
        }

        return this.tasksService.updateTaskStatus(id, status);
    }

}