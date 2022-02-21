import {destructServices, initServices, registerService} from "./config/service-registry";
import {sentryService} from "./service/sentry-service";

registerService(sentryService);





initServices();

process.on('SIGINT', handleTermination);
process.on('SIGTERM', handleTermination);

function handleTermination(args) {
    console.info(`Received ${args} shutting down`);
    destructServices()
        .then(() => process.exit(0));
}
