import {destructServices, initServices, registerService} from "./config/service-registry";
import {sentryService} from "./service/sentry-service";
import {CalendarService} from "./service/calendar-service";
import {ScheduledService} from "./service/schedule-service";

registerService(sentryService);
registerService(CalendarService.service);
registerService(ScheduledService.createScheduleService({
    cron: '0 0 20 * * *',
    fn: CalendarService.fetchCalendarAndNotify
}));

initServices();

process.on('SIGINT', handleTermination);
process.on('SIGTERM', handleTermination);

function handleTermination(args) {
    console.info(`Received ${args} shutting down`);
    destructServices()
        .then(() => process.exit(0));
}
