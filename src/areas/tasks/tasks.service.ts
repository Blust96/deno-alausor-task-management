import { NotFoundError } from 'https://deno.land/x/alosaur/src/mod.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';

import { Task, TaskStatus } from './task.model.ts';
import { CreateTaskDto } from './dto/create-task.dto.ts';

export class TasksService {

    private tasks: Task[] = [];
    
    getAllTasks(search: string, status: string): Task[] {
        let filteredTask = this.tasks;

        if (search || status) {

            filteredTask = filteredTask.filter(task => {
                let returnTask = true;

                if(search && !( task.title.includes(search) || task.description.includes(search) )) { 
                    returnTask = false;
                }

                if(status && task.status !== status) {
                    returnTask = false;
                }
                
                return returnTask ? task : null;
            });

        }

        return filteredTask;
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find(task => task.id === id)
        if (!task) { 
            throw new NotFoundError(`Task with id ${id} not found.`);
        }
        return task;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        
        const task = {
            id: v4.generate(),
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        const tasksLength: number = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        if (tasksLength === this.tasks.length) { 
            throw new NotFoundError(`Task with id ${id} not found.`) 
        }
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        let findTask;
        
        this.tasks = this.tasks.map(task => {
            if(task.id === id) {
                task.status = status;
                findTask = task;
            }
            return task;
        });

        if (!findTask) { 
            throw new NotFoundError(`Task with id ${id} not found.`)
        }

        return findTask;
    }

}