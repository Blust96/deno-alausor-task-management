import { Controller, Get, Body, Param, Post, Delete } from 'https://deno.land/x/alosaur/src/mod.ts';

import { TasksService } from './tasks.service.ts';
import { Task } from './task.model.ts';
import { CreateTaskDto } from './dto/create-task.dto.ts';

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
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): void {
        this.tasksService.deleteTask(id);
    }

}