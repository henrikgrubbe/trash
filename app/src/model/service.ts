export interface Service {
    name: string;
    initFunction: () => Promise<void>;
    destructFunction: () => Promise<void>;
    environmentVariables: string[];
}
