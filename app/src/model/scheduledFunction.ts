export interface ScheduledFunction {
     cron: string;
     fn: () => void;
}
