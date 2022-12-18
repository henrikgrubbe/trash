import {ServiceRegistry} from './config/service-registry';
import {ScheduleService} from './service/schedule-service';
import {CalendarService} from "./service/calendar-service";
import {ScheduledFunction} from "./model/scheduledFunction";

const serviceRegistry = new ServiceRegistry();

const calendarService = new CalendarService();
serviceRegistry.registerService(calendarService);

const scheduledFunctions: ScheduledFunction[] = [
    '0 0 12 * * *',
    '0 0 18 * * *'
].map(cron => ({cron, fn: () => calendarService.fetchCalendarAndNotify()}));
serviceRegistry.registerService(new ScheduleService(...scheduledFunctions));

serviceRegistry.initServices();



process.on('SIGINT', handleTermination);
process.on('SIGTERM', handleTermination);

function handleTermination(args) {
    console.info(`Received ${args} - shutting down`);
    serviceRegistry.destructServices()
        .then(() => process.exit(0));
}
