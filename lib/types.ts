export type ProcessType = 'system' | 'user' | 'background';

export class Process {
    id: string;
    name: string;
    type: ProcessType = 'user';
    priority: number = 0;
    cpuTime: number;
    done: number = 0;
    memNeed: number;
    createdAt: number = Date.now();
    status: 'running' | 'waiting' | 'completed' | 'blocked' | 'terminated' = 'waiting';

    constructor(id: string, name: string, cpuTime: number, memNeed: number, type?: ProcessType, priority?: number) {
        this.id = id;
        this.name = name;
        this.cpuTime = cpuTime;
        this.memNeed = memNeed;
        if (type) this.type = type;
        if (priority !== undefined) this.priority = priority;
    }
}