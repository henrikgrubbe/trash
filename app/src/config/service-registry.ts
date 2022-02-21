import * as dotenv from 'dotenv';
import {Service} from "../model/service";

const services: Service[] = [];

export function registerService(service: Service) {
    services.push(service);
}

export async function initServices(): Promise<void[]> {
    initEnvVars();

    return initFunctions();
}

export async function destructServices(): Promise<void[]> {
    return destructFunctions();
}


function initEnvVars() {
    dotenv.config();

    const envVars: Record<string, string> = {
        'DEBUG': process.env.DEBUG
    }

    services
        .forEach(service => service.environmentVariables
            .forEach(envVar => envVars[envVar] = process.env[envVar]));

    checkEnvVars(envVars);
}

function checkEnvVars(envVars: Record<string, string | undefined>) {
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

async function initFunctions(): Promise<void[]> {
    const promises: Promise<void>[] = [];

    services
        .forEach(service => {
            try {
                promises.push(service.initFunction()
                    .then(() => console.info(`Successfully initialized service ${service.name}`)));
            } catch (e) {
                console.info(`Failed to initialize service ${service.name}`);
                throw e;
            }
        });

    return Promise.all(promises);
}

async function destructFunctions(): Promise<void[]> {
    const promises: Promise<void>[] = [];

    for (const service of services) {
        try {
            promises.push(service.destructFunction()
                .then(() => console.info(`Successfully destructed service ${service.name}`)));
        } catch (e) {
            console.info(`Failed to destruct service ${service.name}`);
            throw e;
        }
    }

    return Promise.all(promises);
}
