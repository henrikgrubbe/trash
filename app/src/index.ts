import {destructServices, initServices, registerService} from "./config/service-registry";
import {sentryService} from "./service/sentry-service";
import {CalendarService} from "./service/calendar-service";

const calendarService: CalendarService = new CalendarService();

registerService(sentryService);
registerService(calendarService.service);


initServices();

process.on('SIGINT', handleTermination);
process.on('SIGTERM', handleTermination);

function handleTermination(args) {
    console.info(`Received ${args} shutting down`);
    destructServices()
        .then(() => process.exit(0));
}
