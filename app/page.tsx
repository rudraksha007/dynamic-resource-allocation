'use client';
import { MAX_MEMORY, MAX_SWAP } from "@/lib/constants";
import { Scheduler, Update } from "@/lib/scheduler";
import { useEffect, useRef, useState } from "react";
import { ProcessMemoryPieChart } from "@/components/charts/ProcessMemoryPieChart";
import { LineChart } from "@/components/charts/LineChart";
import { ProcessTable } from "@/components/ProcessTable";
import { SimulationControls } from "@/components/SimulationControls";
import { AddProcessControls } from "@/components/AddProcessControls";
import { ProcessType } from "@/lib/process";
import { PieChart } from "@/components/charts/PieChart";

type History = {
    timestamp: number;
    value: number;
}

export default function Home() {
  const scheduler = useRef<Scheduler | null>(null);
  const [history, setHistory] = useState<{
    memoryUsed: History[];
    swapUsed: History[];
    cpuUsed: History[];
  }>({
    memoryUsed: [],
    swapUsed: [],
    cpuUsed: []
  });
  const [state, setState] = useState<Update>({
    readyQueue: [],
    swappedQueue: [],
    runningProcess: null,
    completedProcesses: [],
    memoryUsed: 0,
    swapUsed: 0,
    isPaused: false,
    simulationSpeed: 1
  });

  useEffect(() => {
    if (scheduler.current) return;
    scheduler.current = new Scheduler(MAX_MEMORY, MAX_SWAP);

    scheduler.current.onUpdate(({ readyQueue, swappedQueue, runningProcess, completedProcesses, memoryUsed, swapUsed, isPaused, simulationSpeed }) => {
      const timestamp = Date.now();
      
      setState({
        readyQueue: readyQueue,
        swappedQueue: swappedQueue,
        runningProcess: runningProcess,
        completedProcesses: completedProcesses,
        memoryUsed: memoryUsed,
        swapUsed: swapUsed,
        isPaused: isPaused,
        simulationSpeed: simulationSpeed
      });

      // Update history
      setHistory(prev => ({
        memoryUsed: [...prev.memoryUsed, { timestamp, value: memoryUsed }].slice(-100),
        swapUsed: [...prev.swapUsed, { timestamp, value: swapUsed }].slice(-100),
        cpuUsed: [...prev.cpuUsed, { timestamp, value: runningProcess?.cpuDemand || 0 }].slice(-100)
      }));
    });
  }, []);

  const handlePauseToggle = () => {
    if (scheduler.current) {
      scheduler.current.setPaused(!state.isPaused);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (scheduler.current) {
      scheduler.current.setSimulationSpeed(speed);
    }
  };

  const handleAddProcess = (type: 'system' | 'user' | 'background') => {
    if (!scheduler.current) return;
    
    const processTypeMap = {
      'system': ProcessType.System,
      'user': ProcessType.User,
      'background': ProcessType.Background
    };

    const typeLabels = {
      'system': 'SYS',
      'user': 'USR',
      'background': 'BG'
    };

    // Generate random process parameters
    const cpuTime = Math.floor(Math.random() * 5) + 5; // 5-10 units
    const memNeed = Math.floor(Math.random() * 500) + 100; // 100-600 MB
    const cpuDemand = Math.floor(Math.random() * 80) + 10; // 10-90%
    const priority = type === 'system' ? Math.floor(Math.random() * 30) + 70 : 
                     type === 'user' ? Math.floor(Math.random() * 40) + 30 :
                     Math.floor(Math.random() * 30) + 1; // System: 70-100, User: 30-70, Background: 1-30
    
    const name = `${typeLabels[type]}_${Date.now().toString().slice(-4)}`;
    
    const success = scheduler.current.addProcess(
      name,
      cpuTime,
      memNeed,
      cpuDemand,
      processTypeMap[type],
      priority
    );

    if (!success) {
      console.warn(`Failed to add ${type} process - insufficient resources`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Dynamic Resource Allocation Simulator</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system resources and process scheduling in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SimulationControls
          isPaused={state.isPaused}
          simulationSpeed={state.simulationSpeed}
          onPauseToggle={handlePauseToggle}
          onSpeedChange={handleSpeedChange}
        />
        <AddProcessControls onAddProcess={handleAddProcess} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProcessMemoryPieChart 
          title="Main Memory Usage"
          processes={state.readyQueue}
          runningProcess={state.runningProcess}
          memoryUsed={state.memoryUsed}
          maxMemory={MAX_MEMORY}
        />
        <ProcessMemoryPieChart
          title="Swap Memory Usage"
          processes={state.swappedQueue}
          runningProcess={null}
          memoryUsed={state.swapUsed}
          maxMemory={MAX_SWAP}
        />
        <PieChart 
          title="CPU Usage" 
          used={state.runningProcess?.cpuDemand || 0} 
          total={100}
          unit="%" 
        />
      </div>

      <LineChart
        title="Resource Usage Over Time"
        memoryData={history.memoryUsed}
        swapData={history.swapUsed}
        cpuData={history.cpuUsed}
        maxMemory={MAX_MEMORY}
        maxSwap={MAX_SWAP}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProcessTable 
          title="Ready Queue"
          processes={state.runningProcess ? [state.runningProcess, ...state.readyQueue] : state.readyQueue}
          emptyMessage="No processes in ready queue"
        />
        <ProcessTable 
          title="Swapped Queue"
          processes={state.swappedQueue}
          emptyMessage="No processes in swap"
        />
        <ProcessTable 
          title="Last 150 Processes"
          processes={state.completedProcesses}
          emptyMessage="No completed processes yet"
        />
      </div>
    </div>
  );
}