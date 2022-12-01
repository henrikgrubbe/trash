import * as dotenv from 'dotenv';
import {Service} from '../model/service';

export class ServiceRegistry {
    private readonly services: Service[] = [];

    public registerService(service: Service) {
        this.services.push(service);
    }

    public initServices(): Promise<void[]> {
        this.initEnvVars(this.services);

        return this.initFunctions();
    }

    private initEnvVars(services: Service[]) {
        dotenv.config();

        const envVars: Record<string, string> = {
            'DEBUG': process.env.DEBUG
        }

        services
            .forEach(service => service.environmentVariables
                .forEach(envVar => envVars[envVar] = process.env[envVar]));

        ServiceRegistry.checkEnvVars(envVars);
    }

    private static checkEnvVars(envVars: Record<string, string | undefined>) {
        let allEnvVarsFound = true;
        for (const envVar of Object.keys(envVars)) {
            if (envVars[envVar] === undefined) {
                console.warn(`Environment variable ${envVar} not found`);
                allEnvVarsFound = false;
            }
        }

        if (!allEnvVarsFound) {
            console.error("Not all environment variables where found, quitting")
            process.exit(1);
        }
    }

    private initFunctions(): Promise<void[]> {
        const promises: Promise<void>[] = [];

        this.services
            .forEach(service => {
                const envVars = {};
                service.environmentVariables.forEach(envVar => envVars[envVar] = process.env[envVar]);

                promises.push(service.init(envVars)
                    .catch(() => console.warn(`Failed to initialize service ${service.name}`))
                    .then(() => console.info(`Successfully initialized service ${service.name}`)));
            });

        return Promise.all(promises);
    }

    public destructServices(): Promise<void[]> {
        return this.destructFunctions();
    }

    private destructFunctions(): Promise<void[]> {
        const promises: Promise<void>[] = [];

        for (const service of this.services) {
            try {
                promises.push(service.destruct()
                    .then(() => console.info(`Successfully destructed service ${service.name}`)));
            } catch (e) {
                console.info(`Failed to destruct service ${service.name}`);
                throw e;
            }
        }

        return Promise.all(promises);
    }
}