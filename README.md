# Dynamic Resource Allocation Simulator

A real-time **process scheduling and memory management simulator** built with Next.js, React, and TypeScript. It visualizes how an operating system schedules processes, allocates main memory and swap space, and reports basic performance metrics.

---

## Overview

The simulator models a single-CPU system with:

- **Main memory** and **swap space** limits (from `lib/constants.ts`)
- **Processes** of three types: System, User, and Background
- **Priority-based preemptive scheduling** with priority aging
- **Automatic I/O events** that temporarily move processes out of the ready queue
- **Throughput, turnaround time, waiting time, and I/O wait metrics** computed over recent completed processes
- A live **logging sidebar** that shows what the scheduler is doing in real time

All core behavior is implemented in `lib/` and visualized in the React UI under `app/` and `components/`.

---

## Features Implemented

### Process & Scheduling

- Create processes of type **System**, **User**, or **Background** from the control bar
- Each process has:
    - `cpuTime` (work units to complete)
    - `cpuDemand` (approximate CPU usage %)
    - `memNeed` (memory required in MB)
    - `priority` (initial priority based on type)
- **Priority-based scheduling**:
    - Ready queue sorted by priority (higher first)
    - System > User > Background by default
    - Priority **decreases** when a process uses CPU for a time quantum
    - Priority **increases over time** while waiting (aging) so long-waiting processes are eventually served
- **Preemption**:
    - Higher-priority arrivals can preempt lower-priority processes from main memory to swap
    - Running processes can be preempted after a quantum and re-queued

### Memory & Swap Management

- **Main memory** (`MAX_MEMORY` in `lib/constants.ts`) stores the ready queue and running process
- **Swap space** (`MAX_SWAP`) holds processes that cannot fit in main memory
- When adding a process:
    - If enough main memory is free → added directly to the ready queue
    - Otherwise, lower-priority processes may be preempted to swap to make room
    - If neither memory nor swap has enough space, the new process is rejected or some swapped processes are terminated
- After a process completes, the scheduler tries to **swap in** high-priority processes from swap back into main memory

### I/O Behavior

- During execution, a running process may randomly enter an **I/O state** based on `IO_PROBABILITY` (from `lib/constants.ts`)
- I/O wait durations are random within a fixed range
- While in I/O, a process is skipped by the CPU scheduler until its I/O completes and it becomes preempted/ready again

### Metrics

Implemented in `lib/metric.ts` and surfaced in the top control bar and charts:

- Rolling averages over the last `AVG_LOOKBACK_WINDOW` completed (non-terminated) processes:
    - **Average Turnaround Time (TAT)**
    - **Average Waiting Time (WT)**
    - **Average I/O Wait Time**
- **Throughput** (completed processes per minute since simulation start)
- **Starvation indicator**:
    - Tracks the **maximum observed waiting time** among completed processes
    - Control bar highlights long waits (color-coded thresholds)

### System Log Sidebar

- Implemented via `lib/logger.ts` and `components/SystemLog.tsx`
- Shows a scrollable, filterable **terminal-like log** of events:
    - Process creation and admission to ready/swap queues
    - Preemptions and terminations due to memory/swap limits
    - Processes entering I/O and completing execution
    - Starvation warnings when a process waits longer than a defined threshold
    - Simulation-level events (start, pause/resume, auto-generation on/off)
- Supports:
    - Collapse/expand from the right side of the screen
    - Filtering by log level (INFO, SUCCESS, WARNING, ERROR)
    - Auto-scroll toggle and clear-logs action

### UI & Visualizations

All UI lives under `app/` and `components/`:

- **Control bar** (`components/ControlBar.tsx`):
    - Pause/Resume simulation
    - Simulation speed slider (`MIN_SIMULATION_SPEED` → `MAX_SIMULATION_SPEED`)
    - Toggle automatic process generation
    - Quick-add buttons for System/User/Background processes
    - Live display of throughput, average TAT/WT, average I/O wait, and max wait (starvation)
- **Charts** (`components/charts/`):
    - Memory and swap usage over time and as pie charts
    - CPU demand over time
    - Throughput and waiting-time history
- **Tables** (`components/ProcessTable.tsx` and usage in `app/page.tsx`):
    - Ready queue
    - Swapped queue
    - Last 150 completed/terminated processes with optional metrics

---

## Getting Started

### Prerequisites

- Node.js (version compatible with your local environment)
- `pnpm` (recommended) or `npm`

### Install & Run

```bash
pnpm install
pnpm dev
# or
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Build for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

---

## Project Structure (Implemented Parts)

```text
dyn_res_alloc/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main simulator page (wires scheduler, metrics, charts, logs)
│   └── globals.css          # Global styles
│
├── components/
│   ├── ControlBar.tsx       # Top bar: controls + key metrics
│   ├── ProcessTable.tsx     # Generic table for process lists
│   ├── SystemLog.tsx        # Collapsible terminal-style log sidebar
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── MetricsLineChart.tsx
│   │   ├── PieChart.tsx
│   │   └── ProcessMemoryPieChart.tsx
│   └── ui/                  # Reusable UI primitives (button, slider, card, etc.)
│
├── lib/
│   ├── constants.ts         # Simulation constants (memory, swap, probabilities, speeds)
│   ├── process.ts           # Process model, states, and compute loop
│   ├── scheduler.ts         # Priority-based scheduler, memory & swap logic
│   ├── metric.ts            # Rolling metrics and starvation tracking
│   ├── logger.ts            # In-memory logger with subscription API
│   └── utils.ts             # Helper utilities (if used)
│
└── public/                  # Static assets
```

This README describes only the functionality and structure that are currently implemented in the codebase.

### What is a Time Slice?
A **time slice** (or quantum) is the amount of time a process runs before the scheduler checks if another process should run. In this simulator, it's randomly 1-6 units to simulate real-world variability.

---

## 🛠️ Technologies Used

### Frontend Framework
- **Next.js 16.0.7**: React framework with server-side rendering
- **React 19.2.0**: UI component library
- **TypeScript 5**: Type-safe JavaScript

### UI Components
- **shadcn/ui**: High-quality accessible components
- **Radix UI**: Primitive UI components
- **Lucide React**: Icon library
- **Recharts**: Charting library for visualizations

### Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Utility class merging

### Package Management
- **pnpm**: Fast, disk space efficient package manager

---

## 🤝 Contributing

Contributions are welcome! Here are some ways you can improve this project:

### Enhancement Ideas
1. **Add More Scheduling Algorithms**
   - Round Robin
   - Shortest Job First (SJF)
   - Multi-level Queue Scheduling

2. **Improve Visualizations**
   - Gantt chart for process timeline
   - Animated process state transitions
   - 3D memory visualization

3. **Add Features**
   - Process dependencies
   - I/O operations simulation
   - Deadlock detection
   - Save/load simulation scenarios

4. **Educational Content**
   - In-app tutorials
   - Algorithm explanations
   - Quiz mode

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available for educational purposes.

---

## 🙏 Acknowledgments

- Inspired by operating system scheduling algorithms taught in CS courses
- Built with modern web technologies for interactive learning
- Thanks to the open-source community for the amazing tools and libraries

---

## 📚 Learn More

### Recommended Reading
- **Operating System Concepts** by Silberschatz, Galvin, and Gagne
- **Modern Operating Systems** by Andrew S. Tanenbaum
- [GeeksforGeeks - CPU Scheduling](https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/)

### Related Concepts
- Process synchronization and deadlocks
- Virtual memory management
- Paging and segmentation
- Inter-process communication (IPC)

---

## 💡 Usage Tips

1. **Start Simple**: Add a few processes and watch them execute
2. **Test Limits**: Add many processes to see memory management in action
3. **Observe Preemption**: Add a high-priority system process while user processes run
4. **Watch Priority Aging**: Pause and observe how priorities change over time
5. **Adjust Speed**: Slow down to see details, speed up to test system under load

---

**Happy Learning! 🚀**

If you have questions or find bugs, please open an issue on GitHub.
