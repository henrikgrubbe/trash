import {Service} from "../model/service";

const schedule = require('node-schedule');

export interface ScheduledFunction {
    cron: string;
    fn: () => void;
}

export function createScheduleService(...scheduledFunctions: ScheduledFunction[]): Service {
    return {
        name: 'Schedule',
        initFunction: () => initSchedule(...scheduledFunctions),
        destructFunction: destructSchedule,
        environmentVariables: []
    };
}

function initSchedule(...scheduledFunctions: (ScheduledFunction)[]): Promise<void> {
    scheduledFunctions
        .forEach((scheduledFunction => schedule.scheduleJob(scheduledFunction.cron, scheduledFunction.fn)))

    return Promise.resolve();
}

function destructSchedule(): Promise<void> {
    return schedule.gracefulShutdown();
}
