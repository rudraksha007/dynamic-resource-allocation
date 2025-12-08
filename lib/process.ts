export enum ProcessType {
    Background = 1,
    User = 2,
    System = 3,
}

export enum ProcessState {
    Terminated = -1,
    Waiting = 0,
    Running = 1,
    Completed = 2,
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
    updatedAt: number = Date.now();
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
}