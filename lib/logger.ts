export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

export interface LogEntry {
    id: number;
    timestamp: string;
    level: LogLevel;
    message: string;
}

export class Logger {
    private static instance: Logger;
    private logs: LogEntry[] = [];
    private logCounter: number = 0;
    private readonly MAX_LOGS = 500;
    private onLogCallback: ((log: LogEntry) => void) | null = null;

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatTimestamp(): string {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    private addLog(level: LogLevel, message: string) {
        const log: LogEntry = {
            id: this.logCounter++,
            timestamp: this.formatTimestamp(),
            level,
            message
        };

        this.logs.push(log);
        if (this.logs.length > this.MAX_LOGS) {
            this.logs.shift();
        }

        if (this.onLogCallback) {
            this.onLogCallback(log);
        }
    }

    info(message: string) {
        this.addLog('INFO', message);
    }

    warn(message: string) {
        this.addLog('WARNING', message);
    }

    error(message: string) {
        this.addLog('ERROR', message);
    }

    success(message: string) {
        this.addLog('SUCCESS', message);
    }

    onLog(callback: (log: LogEntry) => void) {
        this.onLogCallback = callback;
    }

    getLogs(): LogEntry[] {
        return [...this.logs];
    }

    clear() {
        this.logs = [];
        this.logCounter = 0;
    }
}
