import { AppSettings } from 'https://deno.land/x/alosaur/src/mod.ts';
import { TasksArea } from './areas/tasks/tasks.area.ts';

export const settings: AppSettings = {
    areas: [TasksArea],
    middlewares: [],
    logging: false,
}