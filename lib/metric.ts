import { AVG_LOOKBACK_WINDOW, METRIC_UPDATE_INTERVAL } from "./constants";
import { Update } from "./scheduler";

export class MetricCalculator {
    lastPID: number = -1;
    startedAt: number;
    completedProcesses: number = 0;
    longestWaitTime: number = 0;
    
    // Store last 20 processes' metrics
    private tatHistory: number[] = [];
    private wtHistory: number[] = [];
    private ioTimeHistory: number[] = [];

    updateMetricCallback: ((avgTAT: number, avgWT: number, throughput: number, avgIOWait: number, starvationTime: number) => void) | null = null;

    constructor() {
        this.startedAt = Date.now();
        this.runMetricLoop();
    }

    recordUpdate(update: Update) {
        if (update.completedProcesses.length === 0) return;
        const len = update.completedProcesses.length;
        if (update.completedProcesses[len - 1].id == this.lastPID) return;
        let lid = update.completedProcesses[len - 1].id;
        for (let i=len -1; i>=0; i--) {
            if (update.completedProcesses[i].id == this.lastPID) break;
            if (update.completedProcesses[i].status === "Terminated") continue;
            const process = update.completedProcesses[i];
            const turnaroundTime = (process.endedAt! - process.createdAt) / 1000;
            const cpuTime = process.cpuTime;
            const ioTime = process.ioTime ? process.ioTime / 1000 : 0;
            const waitingTime = turnaroundTime - cpuTime - ioTime;
            
            // Add to history arrays and maintain max size
            this.tatHistory.push(turnaroundTime);
            if (this.tatHistory.length > AVG_LOOKBACK_WINDOW) {
                this.tatHistory.shift();
            }
            
            this.wtHistory.push(waitingTime > 0 ? waitingTime : 0);
            if (this.wtHistory.length > AVG_LOOKBACK_WINDOW) {
                this.wtHistory.shift();
            }
            
            this.ioTimeHistory.push(ioTime);
            if (this.ioTimeHistory.length > AVG_LOOKBACK_WINDOW) {
                this.ioTimeHistory.shift();
            }
            
            this.completedProcesses += 1;
            
            // Track longest wait time
            if (waitingTime > this.longestWaitTime) {
                this.longestWaitTime = waitingTime;
            }
        }
        this.lastPID = lid;
    }

    runMetricLoop() {
        setInterval(() => {
            if (this.tatHistory.length === 0) return;
            
            // Calculate averages from last 20 processes
            const avgTAT = this.tatHistory.reduce((sum, val) => sum + val, 0) / this.tatHistory.length;
            const avgWT = this.wtHistory.reduce((sum, val) => sum + val, 0) / this.wtHistory.length;
            const avgIOWait = this.ioTimeHistory.reduce((sum, val) => sum + val, 0) / this.ioTimeHistory.length;
            
            const elapsedMinutes = (Date.now() - this.startedAt) / 60000;
            const throughput = this.completedProcesses / elapsedMinutes;
            
            if (this.updateMetricCallback) {
                this.updateMetricCallback(avgTAT, avgWT, throughput, avgIOWait, this.longestWaitTime);
            }
        }, METRIC_UPDATE_INTERVAL);
    }
}