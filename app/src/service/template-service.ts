import {Service} from "../model/service";

export const templateService: Service = {
    name: 'Template',
    initFunction: initService,
    destructFunction: destructService,
    environmentVariables: []
}

export function createTemplateServiceAdvanced(...functions: (() => void)[]): Service {
    return {
        name: 'TemplateAdvanced',
        initFunction: () => initServiceAdvanced(...functions),
        destructFunction: destructService,
        environmentVariables: []
    };
}

function initService(): Promise<void> {
    console.info('Initializing template service');

    return Promise.resolve();
}

function initServiceAdvanced(...scheduledFunctions: (() => void)[]): Promise<void> {
    scheduledFunctions
        .forEach((fn) => fn());

    console.info('Initializing advanced template service');

    return Promise.resolve();
}

function destructService(): Promise<void> {
    console.info('Template service destructed');
    return Promise.resolve();
}
