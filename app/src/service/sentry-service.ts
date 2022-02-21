import {Service} from "../model/service";

const Sentry = require("@sentry/node");

export const sentryService: Service = {
    name: 'Sentry',
    initFunction: initService,
    destructFunction: destructService,
    environmentVariables: [
        'SENTRY_DSN',
        'SENTRY_RELEASE',
    ]
}

function initService(): Promise<void> {
    const dsn = process.env.SENTRY_DSN;
    const release = process.env.SENTRY_RELEASE;

    const options = {
        dsn,
        release
    };

    if (release === 'dev') {
        options['environment'] = 'dev';
    }

    console.info(`Initializing Sentry (release: ${release})`);

    Sentry.init(options);

    return Promise.resolve();
}

function destructService(): Promise<void> {
    return Sentry.close();
}
