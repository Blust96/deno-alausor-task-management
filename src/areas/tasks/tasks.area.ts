import { Area } from 'https://deno.land/x/alosaur/src/mod.ts';
import { TasksController } from './tasks.controller.ts';

@Area({
    baseRoute: '/tasks',
    controllers: [TasksController],
})
export class TasksArea {}