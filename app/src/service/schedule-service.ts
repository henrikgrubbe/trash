import {Service} from "../model/service";

const schedule = require('node-schedule');

export interface ScheduledFunction {
    cron: string;
    fn: () => void;
}

export class ScheduledService {

    public static createScheduleService(...scheduledFunctions: ScheduledFunction[]): Service {
        return {
            name: 'Schedule',
            initFunction: () => ScheduledService.initService(...scheduledFunctions),
            destructFunction: ScheduledService.destructService,
            environmentVariables: []
        };
    }

    private static initService(...scheduledFunctions: (ScheduledFunction)[]): Promise<void> {
        scheduledFunctions
            .forEach((scheduledFunction => schedule.scheduleJob(scheduledFunction.cron, scheduledFunction.fn)))

        return Promise.resolve();
    }

    private static destructService(): Promise<void> {
        return schedule.gracefulShutdown();
    }
}

