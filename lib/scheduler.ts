import { Process, ProcessState, ProcessType } from "./process";

export class Scheduler {
    readonly maxMemory: number;
    readonly maxSwap: number;
    readyQueue: Process[] = [];
    swappedQueue: Process[] = [];
    runningProcess: Process | null = null;
    memoryUsed: number = 0
    swapUsed: number = 0;
    isPaused: boolean = false;
    simulationSpeed: number = 1;
    programCounter: number = 0;

    constructor(maxMemory: number, maxSwap: number) {
        if (maxMemory <= 0 || maxSwap < 0 || maxMemory < maxSwap) {
            throw new Error("Invalid memory or swap size. Main memory must be > 0, swap >= 0, and main memory must be >= swap.");
        }
        this.maxMemory = maxMemory;
        this.maxSwap = maxSwap;
    }

    private pushToReadyQueue(processes: Process[]) {
        this.readyQueue.push(...processes);
        this.memoryUsed += processes.reduce((acc, proc) => acc + proc.memNeed, 0);
        this.readyQueue.sort((a, b) => b.priority - a.priority);
    }

    private trySwapIn() {
        this.swapPriorityGrowth();
        const swappable: number[] = [];
        let acc = 0;
        for (let i = 0; i < this.swappedQueue.length; i++) {
            const proc = this.swappedQueue[i];
            if (this.memoryUsed + acc + proc.memNeed <= this.maxMemory) {
                acc += proc.memNeed;
                swappable.push(i);
            } else {
                break;
            }
        }
        const toSwapIn: Process[] = swappable.map(idx => {
            const proc = this.swappedQueue[idx];
            return proc;
        });
        for (let i = swappable.length - 1; i >= 0; i--) {
            this.swappedQueue.splice(swappable[i], 1);
        }
        this.swapUsed -= acc;
        this.pushToReadyQueue(toSwapIn);


    }

    addProcess(name: string, cpuTime: number, memNeed: number, cpuDemand?: number, type?: ProcessType, priority?: number): boolean {
        const process = new Process(this.programCounter++, name, cpuTime, memNeed, cpuDemand, type, priority);
        if (this.memoryUsed + process.memNeed <= this.maxMemory) {
            // Insert process based on priority
            for (let i = 0; i < this.readyQueue.length; i++) {
                if (process.priority > this.readyQueue[i].priority) {
                    this.readyQueue.splice(i, 0, process);
                    this.memoryUsed += process.memNeed;
                    return true;
                }
            }
            this.pushToReadyQueue([process]);
            return true;
        } else {
            if (this.readyQueue.length < 1) return false;
            let managable = 0;
            const premptable: number[] = [];
            for (let i = this.readyQueue.length - 1; i >= 0; i--) {
                if (this.readyQueue[i].priority * process.type < process.priority * process.type) {
                    managable += this.readyQueue[i].memNeed;
                    premptable.push(i);
                }
                else break;
                if (managable >= process.memNeed) break;
            }
            if (managable >= process.memNeed) {
                for (let idx of premptable) {
                    const proc = this.readyQueue[idx];
                    this.memoryUsed -= proc.memNeed;
                    if (!this.addProcessToSwap(proc)) {
                        proc.status = ProcessState.Terminated;
                    }
                    this.readyQueue.splice(idx, 1);
                }
                this.pushToReadyQueue([process]);
                return true;
            } else {
                if (!this.addProcessToSwap(process)) {
                    return false; // Not enough memory or swap
                }
            }
        }
        return false; // Not enough memory or swap
    }

    addProcessToSwap(process: Process): boolean {
        if (this.swapUsed + process.memNeed <= this.maxSwap) {
            this.swappedQueue.push(process);
            this.swapUsed += process.memNeed;
            return true;
        } else {
            if (this.swappedQueue.length < 1) return false;
            let managable = 0;
            const killable: number[] = [];
            for (let i = this.swappedQueue.length - 1; i >= 0; i--) {
                if (this.swappedQueue[i].priority * process.type < process.priority * process.type) {
                    managable += this.swappedQueue[i].memNeed;
                    killable.push(i);
                }
                else break;
                if (managable >= process.memNeed) break;
            }
            if (managable >= process.memNeed) {
                for (let idx of killable) {
                    const proc = this.swappedQueue[idx];
                    this.swapUsed -= proc.memNeed;
                    proc.status = ProcessState.Terminated;
                    this.swappedQueue.splice(idx, 1);
                }
                this.swappedQueue.push(process);
                this.swapUsed += process.memNeed;
                return true;
            }
            return false; // Not enough swap
        }
    }

    async swapPriorityGrowth() {
        for (let process of this.swappedQueue) {
            const waitingTime = Date.now() - process.updatedAt;
            process.updatedAt = Date.now();
            process.priority += Math.floor(waitingTime / 5000) * process.type;
        }
        this.swappedQueue.sort((a, b) => b.priority - a.priority);
    }

    async priorityGrowth() {
        for (let process of this.readyQueue) {
            const waitingTime = Date.now() - process.updatedAt;
            process.updatedAt = Date.now();
            process.priority += Math.floor(waitingTime / 5000) * process.type;
        }
        this.readyQueue.sort((a, b) => b.priority - a.priority);
    }

    async processExecutionLoop() {
        while (true) {
            if (this.isPaused) await new Promise(res => setTimeout(res, 1000));
            else {
                if (!this.runningProcess && this.readyQueue.length < 1) await new Promise(res => setTimeout(res, 1000));
                else {
                    this.runningProcess = this.readyQueue.shift()!;
                    this.runningProcess.status = ProcessState.Running;
                    const execAmt = (Math.random() * 5) + 1;
                    await new Promise((res) => {
                        let i = 0;
                        const id = setInterval(() => {
                            if (this.isPaused) return;
                            this.runningProcess!.done += 1;
                            if (this.runningProcess!.done >= this.runningProcess!.cpuTime) {
                                this.runningProcess!.status = ProcessState.Completed;
                                this.memoryUsed -= this.runningProcess!.memNeed;
                                this.runningProcess = null;
                                this.trySwapIn();
                                clearInterval(id);
                                return res(null);
                            }
                            if (i >= execAmt) {
                                const proc = this.runningProcess!;          // store reference
                                proc.status = ProcessState.Waiting;

                                this.readyQueue.push(proc);
                                this.readyQueue.sort((a, b) => b.priority - a.priority);

                                this.runningProcess = null;
                                clearInterval(id);
                                return res(null);     // << also add return!
                            }
                            i++;
                        }, 1000 / this.simulationSpeed);
                    });
                    this.priorityGrowth();
                }
            }
        }
    }
}