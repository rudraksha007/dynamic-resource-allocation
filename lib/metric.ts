import { METRIC_UPDATE_INTERVAL } from "./constants";
import { Update } from "./scheduler";

export class MetricCalculator {
    lastPID: number = -1;
    startedAt: number;
    totalTAT: number = 0;
    totalWT: number = 0;
    totalIOTime: number = 0;
    completedProcesses: number = 0;
    longestWaitTime: number = 0;

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
            this.totalTAT += turnaroundTime;
            this.totalWT += waitingTime > 0 ? waitingTime : 0;
            this.totalIOTime += ioTime;
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
            if (this.completedProcesses === 0) return;
            const avgTAT = this.totalTAT / this.completedProcesses;
            const avgWT = this.totalWT / this.completedProcesses;
            const elapsedMinutes = (Date.now() - this.startedAt) / 60000;
            const throughput = this.completedProcesses / elapsedMinutes;
            const avgIOWait = this.totalIOTime / this.completedProcesses;
            
            if (this.updateMetricCallback) {
                this.updateMetricCallback(avgTAT, avgWT, throughput, avgIOWait, this.longestWaitTime);
            }
        }, METRIC_UPDATE_INTERVAL);
    }
}