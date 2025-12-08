# Dynamic Resource Allocation Simulator

A real-time **Operating System Process Scheduler and Memory Management Simulator** built with Next.js, React, and TypeScript. This interactive visualization demonstrates how operating systems manage processes, allocate memory, and handle resource constraints using advanced scheduling algorithms.

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

---

## 📚 Table of Contents

- [What This Project Does](#-what-this-project-does)
- [Key Features](#-key-features)
- [How It Works - The Algorithms](#-how-it-works---the-algorithms)
- [Understanding the Interface](#-understanding-the-interface)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Technical Concepts for Beginners](#-technical-concepts-for-beginners)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)

---

## 🎯 What This Project Does

This simulator helps you **visualize and understand** how a computer's operating system manages multiple running programs (called **processes**) and allocates limited resources like:

- **RAM (Main Memory)**: Where active processes run
- **Swap Space**: Backup storage when RAM is full
- **CPU Time**: Processing power distributed among processes

Think of it like a traffic controller managing cars (processes) on limited roads (memory) with a single traffic light (CPU).

---

## ✨ Key Features

### 1. **Real-Time Process Management**
- Add system, user, and background processes dynamically
- Watch processes move through different states (Waiting → Running → Completed)
- Automatic process prioritization and scheduling

### 2. **Memory Management**
- **4 GB Main Memory** simulation (configurable)
- **2 GB Swap Space** for overflow handling
- Visual memory usage tracking with pie charts and line graphs

### 3. **Priority-Based Scheduling**
- **System Processes**: Highest priority (70-100)
- **User Processes**: Medium priority (30-70)
- **Background Processes**: Lowest priority (1-30)

### 4. **Advanced Features**
- **Process Preemption**: High-priority processes can interrupt lower-priority ones
- **Swap Management**: Automatic swapping when memory is full
- **Priority Aging**: Waiting processes gradually increase in priority to prevent starvation
- **Adjustable Simulation Speed**: Control from 0.5x to 5x real-time

---

## 🧠 How It Works - The Algorithms

### 1. **Priority-Based Preemptive Scheduling Algorithm**

This simulator uses a **dynamic priority queue** where processes are scheduled based on their priority score.

#### Priority Calculation
```
Priority Score = Base Priority + (Waiting Time / 5000ms) × Process Type Weight
```

**Process Type Weights:**
- System (3): Gains priority fastest
- User (2): Moderate priority growth
- Background (1): Slowest priority growth

#### Scheduling Steps

**Step 1: Process Arrival**
```
When a new process arrives:
1. Check if there's enough free memory (RAM)
2. If YES → Add to Ready Queue (sorted by priority)
3. If NO → Check if lower-priority processes can be preempted
4. If preemption possible → Swap out lower-priority processes
5. If NO space even after preemption → Add to Swap Space
```

**Step 2: Process Execution**
```
The CPU scheduler continuously:
1. Select highest priority process from Ready Queue
2. Execute process for a random time slice (1-6 units)
3. After time slice:
   - If process completed → Move to Completed list
   - If not completed → Return to Ready Queue (preemption)
4. Repeat
```

**Step 3: Priority Aging**
```
Every 5 seconds:
FOR each waiting process:
    priority += (waitTime / 5000) × processType
END FOR
Resort queue by new priorities
```

This prevents **starvation** - where low-priority processes never get CPU time.

---

### 2. **Memory Management Algorithm**

#### Memory Allocation Strategy

**Main Memory Allocation:**
```
FUNCTION addProcess(process):
    requiredMemory = process.memNeed
    
    IF (memoryUsed + requiredMemory <= MAX_MEMORY):
        // Space available
        Allocate memory
        Add to Ready Queue
        RETURN success
    
    ELSE:
        // Memory full - try preemption
        candidates = Find lower priority processes
        
        IF (sum(candidates.memory) >= requiredMemory):
            Preempt candidates → Move to Swap
            Allocate freed memory to new process
            RETURN success
        
        ELSE:
            // Try adding directly to swap
            Add to Swap Queue
            RETURN depends on swap availability
    END IF
END FUNCTION
```

#### Swap Space Management

When main memory is full, processes move to **swap space** (simulated disk storage):

```
FUNCTION addToSwap(process):
    requiredSpace = process.memNeed
    
    IF (swapUsed + requiredSpace <= MAX_SWAP):
        Add to Swap Queue
        RETURN success
    
    ELSE:
        // Swap is full - must terminate lowest priority processes
        candidates = Find lowest priority processes in swap
        
        IF (sum(candidates.memory) >= requiredSpace):
            Terminate candidates
            Add new process to swap
            RETURN success
        
        ELSE:
            Terminate new process (no space)
            RETURN failure
    END IF
END FUNCTION
```

#### Swap-In Algorithm

The system continuously tries to move processes from swap back to main memory:

```
FUNCTION trySwapIn():
    Apply priority aging to swapped processes
    Sort Swap Queue by priority (highest first)
    
    FOR each process in Swap Queue (in order):
        IF (memoryUsed + process.memNeed <= MAX_MEMORY):
            Move process to Ready Queue
            Update memory counters
        ELSE:
            BREAK // No more space
        END IF
    END FOR
END FUNCTION
```

This is called after every process completion to maximize memory utilization.

---

### 3. **Process States & Lifecycle**

Every process goes through these states:

```
┌─────────────┐
│   WAITING   │ ← Process added but not running
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   RUNNING   │ ← Currently executing on CPU
└──────┬──────┘
       │
       ├──→ ┌─────────────┐
       │    │  PREEMPTED  │ ← Interrupted by higher priority
       │    └──────┬──────┘
       │           │
       │           ↓
       │    (Returns to Ready Queue)
       │
       ├──→ ┌─────────────┐
       │    │  COMPLETED  │ ← Finished successfully
       │    └─────────────┘
       │
       └──→ ┌─────────────┐
            │ TERMINATED  │ ← Killed due to resource constraints
            └─────────────┘
```

---

## 🖥️ Understanding the Interface

### Main Dashboard Components

1. **Simulation Controls**
   - ⏯️ Pause/Resume button
   - 🎚️ Speed slider (0.5x to 5x)

2. **Add Process Controls**
   - Add System Process (highest priority)
   - Add User Process (medium priority)
   - Add Background Process (lowest priority)

3. **Process Tables**
   - **Ready Queue**: Processes in memory waiting for CPU
   - **Running Process**: Currently executing (highlighted)
   - **Swapped Queue**: Processes moved to swap space
   - **Completed Processes**: Finished or terminated (last 150)

4. **Charts**
   - **Memory Usage Pie Chart**: RAM vs Free Memory
   - **Swap Usage Pie Chart**: Swap vs Free Swap
   - **CPU Usage Line Chart**: Real-time CPU demand
   - **Memory History Line Chart**: Memory usage over time

### Process Information

Each process displays:
- **ID**: Unique identifier
- **Name**: Process type label (SYS/USR/BG) + ID
- **Type**: System (3), User (2), or Background (1)
- **Priority**: Current priority score
- **CPU Demand**: Processing power required (%)
- **CPU Time**: Total execution time needed
- **Done**: Progress (units completed)
- **Memory**: RAM requirement (MB)
- **Status**: Current state

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20 or higher)
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dyn_res_alloc
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

### Building for Production

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

```
dyn_res_alloc/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Main dashboard page
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── AddProcessControls.tsx   # Process creation buttons
│   ├── ProcessTable.tsx         # Process list display
│   ├── ReadyQueueTable.tsx      # Ready queue visualization
│   ├── SimulationControls.tsx   # Pause/speed controls
│   ├── SwappedQueueTable.tsx    # Swap queue visualization
│   ├── charts/                  # Chart components
│   │   ├── LineChart.tsx        # Time-series graphs
│   │   ├── PieChart.tsx         # Resource pie charts
│   │   └── ProcessMemoryPieChart.tsx
│   └── ui/                      # shadcn/ui components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
│
├── lib/                         # Core logic
│   ├── constants.ts             # System configuration
│   ├── process.ts               # Process class & types
│   ├── scheduler.ts             # Scheduling algorithm
│   └── utils.ts                 # Utility functions
│
└── public/                      # Static assets
```

### Key Files Explained

#### `lib/process.ts`
Defines the `Process` class and types:
- Process states and types
- Process properties (ID, priority, memory, CPU time)
- State transitions

#### `lib/scheduler.ts`
Core scheduling logic:
- `Scheduler` class manages all processes
- Priority-based queue management
- Memory allocation/deallocation
- Swap management algorithms
- Priority aging mechanism
- Process execution loop

#### `lib/constants.ts`
System configuration:
- `MAX_MEMORY`: 4096 MB (4 GB)
- `MAX_SWAP`: 2048 MB (2 GB)
- Simulation speed limits

#### `app/page.tsx`
Main UI component:
- Initializes scheduler
- Manages UI state
- Handles user interactions
- Updates charts and tables

---

## 📖 Technical Concepts for Beginners

### What is a Process?
A **process** is a program in execution. When you open an app, the operating system creates a process for it. Each process needs:
- **CPU Time**: To execute instructions
- **Memory**: To store data and code
- **Priority**: Importance level for scheduling

### What is a Scheduler?
The **scheduler** is like a manager that decides:
- Which process runs next
- For how long it runs
- What to do when resources are limited

### What is Preemption?
**Preemption** is when a running process is interrupted by a higher-priority process. Like an ambulance getting priority over regular traffic.

### What is Swap Space?
**Swap space** is hard disk space used as "overflow" when RAM is full. It's much slower than RAM but prevents the system from running out of memory entirely.

### What is Priority Aging?
**Priority aging** gradually increases the priority of waiting processes over time. This ensures that even low-priority processes eventually get CPU time, preventing **starvation**.

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
