import {Service} from "../model/service";
import {ScheduledFunction} from "../model/scheduledFunction";

const schedule = require('node-schedule');


export class ScheduleService implements Service {
    public readonly name = 'Schedule';
    public readonly environmentVariables = [];

    private readonly scheduledFunctions: ScheduledFunction[] = [];

    constructor(...scheduledFunctions: ScheduledFunction[]) {
        this.scheduledFunctions = scheduledFunctions;
    }

    public init(_: Record<string, string>): Promise<void> {
        this.scheduledFunctions
            .forEach((scheduledFn => schedule.scheduleJob(scheduledFn.cron, scheduledFn.fn)))

        return Promise.resolve();
    }

    public destruct(): Promise<void> {
        return schedule.gracefulShutdown();
    }
}