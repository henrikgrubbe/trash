import {destructServices, initServices, registerService} from "./config/service-registry";
import {sentryService} from "./service/sentry-service";
import {createTemplateServiceAdvanced, templateService} from "./service/template-service";

registerService(sentryService);

registerService(templateService);
registerService(createTemplateServiceAdvanced(() => console.log('template function 1'), () => console.log('template function 2')));



initServices();


process.on('SIGINT', handleTermination);
process.on('SIGTERM', handleTermination);

function handleTermination(args) {
    console.info(`Received ${args} shutting down`);
    destructServices()
        .then(() => process.exit(0));
}
