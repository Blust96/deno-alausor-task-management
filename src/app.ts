import { App } from 'https://deno.land/x/alosaur/src/mod.ts';
import transformer from 'https://dev.jspm.io/class-transformer@0.2.3';

import { settings } from './app-settings.ts';

const { plainToClass } = transformer;

// Creating application
const app = new App(settings);
app.useTransform({
    type: 'body', // parse body params
    getTransform: (transform: any, body: any) => {
        return plainToClass(transform, body);
    }
});
app.listen();