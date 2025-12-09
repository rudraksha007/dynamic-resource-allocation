import { IO_PROBABILITY } from "./constants";

export enum ProcessType {
    Background = 1,
    User = 2,
    System = 3,
}

export enum ProcessState {
    Terminated = -2,
    Preempted = -1,
    Waiting = 0,
    Running = 1,
    IO = 2,
    Completed = 3,
}

export type ProcessStatus = "Terminated" | "Preempted" | "Waiting" | "Running" | "IO" | "Completed";
export const ProcessStateMap: { [key in ProcessState]: ProcessStatus } = {
    [ProcessState.Terminated]: "Terminated",
    [ProcessState.Preempted]: "Preempted",
    [ProcessState.Waiting]: "Waiting",
    [ProcessState.Running]: "Running",
    [ProcessState.IO]: "IO",
    [ProcessState.Completed]: "Completed",
}

export type ProcessInfo = {
    id: number;
    name: string;
    type: ProcessType;
    priority: number;
    cpuDemand: number;
    cpuTime: number;
    done: number;
    memNeed: number;
    status: ProcessStatus;
    endedAt?: number;
    ioStartTime?: number;
    ioTime?: number;
    createdAt: number;
}

export class Process {
    id: number;
    name: string;
    type: ProcessType = ProcessType.User;
    priority: number = 0;
    cpuDemand: number = 1;
    cpuTime: number;
    done: number = 0;
    memNeed: number;
    createdAt: number = Date.now();
    ioStartTime: number = 0;
    ioTime: number = 0;
    updatedAt: number = Date.now();
    endedAt?: number;
    status: ProcessState = ProcessState.Waiting;

    constructor(id: number, name: string, cpuTime: number, memNeed: number, cpuDemand?: number, type?: ProcessType, priority?: number) {
        this.id = id;
        this.name = name;
        this.cpuTime = cpuTime;
        this.memNeed = memNeed;
        if (cpuDemand !== undefined) {
            if (cpuDemand < 1) {
                this.cpuDemand = 1;
            } else if (cpuDemand > 100) {
                this.cpuDemand = 100;
            } else this.cpuDemand = cpuDemand;
        }
        if (type) this.type = type;
        if (priority !== undefined) this.priority = priority;
    }

    async compute(amt: number, simSpeed: number): Promise<boolean> {
        let i = 0;
        return new Promise<boolean>((resolve) => {
            const id = setInterval(() => {
                i++;
                this.done++;
                this.updatedAt = Date.now();
                if (this.done >= this.cpuTime) {
                    this.status = ProcessState.Completed;
                    this.endedAt = Date.now();
                    clearInterval(id);
                    resolve(true);
                } else if (i >= amt) {
                    if (Math.random() < IO_PROBABILITY) {
                        this.status = ProcessState.IO;
                        this.ioStartTime = Date.now();
                        this.ioTime = (Math.random() * 3 + 2) * 1000; // IO wait between 2-5 seconds
                        setTimeout(() => {
                            this.status = ProcessState.Preempted;
                            this.updatedAt = Date.now();
                        }, this.ioTime);
                    } else {
                        this.status = ProcessState.Preempted;
                    }
                    clearInterval(id);
                    resolve(false);
                }
            }, 800 / simSpeed);
        });
    }
}