export interface Service {
    readonly name: string;
    readonly environmentVariables: string[];
    readonly init: (envVars: Record<string, string>) => Promise<void>;
    readonly destruct: () => Promise<void>;
}
