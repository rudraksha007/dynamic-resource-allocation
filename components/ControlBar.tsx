'use client';

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { MIN_SIMULATION_SPEED, MAX_SIMULATION_SPEED } from "@/lib/constants";
import { useState } from "react";

interface ControlBarProps {
  isPaused: boolean;
  simulationSpeed: number;
  onPauseToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onAddProcess: (type: 'system' | 'user' | 'background') => void;
  isAutoGenerating: boolean;
  onAutoGenerateToggle: () => void;
  avgTAT: number;
  avgWT: number;
  throughput: number;
  avgIOWait: number;
  starvationTime: number;
}

export function ControlBar({ 
  isPaused, 
  simulationSpeed, 
  onPauseToggle, 
  onSpeedChange,
  onAddProcess,
  isAutoGenerating,
  onAutoGenerateToggle,
  avgTAT,
  avgWT,
  throughput,
  avgIOWait,
  starvationTime
}: ControlBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col gap-4">
          {/* Always visible: Controls row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Left: Simulation Controls */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={onPauseToggle} 
                variant={isPaused ? "default" : "secondary"}
                size="sm"
              >
                {isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                )}
              </Button>
              
              <div className="flex items-center gap-2 min-w-[200px]">
                <span className="text-sm font-medium whitespace-nowrap">Speed:</span>
                <Slider
                  value={[simulationSpeed]}
                  onValueChange={(values) => onSpeedChange(values[0])}
                  min={MIN_SIMULATION_SPEED}
                  max={MAX_SIMULATION_SPEED}
                  step={0.1}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground min-w-[3ch]">
                  {simulationSpeed.toFixed(1)}x
                </span>
              </div>
              
              <Button 
                onClick={onAutoGenerateToggle} 
                variant={isAutoGenerating ? "default" : "outline"}
                size="sm"
              >
                {isAutoGenerating ? "Stop Auto-Gen" : "Auto-Generate"}
              </Button>
            </div>

            {/* Center: Key Metrics */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Throughput:</span>
                <span className="font-semibold">
                  {isNaN(throughput) ? "N/A" : `${throughput.toFixed(2)}/min`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Avg TAT:</span>
                <span className="font-semibold">
                  {isNaN(avgTAT) ? "N/A" : `${avgTAT.toFixed(2)}s`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Avg WT:</span>
                <span className="font-semibold">
                  {isNaN(avgWT) ? "N/A" : `${avgWT.toFixed(2)}s`}
                </span>
              </div>
            </div>

            {/* Right: Add Process Buttons + Expand Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">Add:</span>
              <Button 
                onClick={() => onAddProcess('system')} 
                size="sm"
                variant="outline"
              >
                <Plus className="mr-1 h-3 w-3" />
                System
              </Button>
              <Button 
                onClick={() => onAddProcess('user')} 
                size="sm"
                variant="outline"
              >
                <Plus className="mr-1 h-3 w-3" />
                User
              </Button>
              <Button 
                onClick={() => onAddProcess('background')} 
                size="sm"
                variant="outline"
              >
                <Plus className="mr-1 h-3 w-3" />
                Background
              </Button>
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                size="sm"
                variant="ghost"
                className="ml-2"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Expandable: Additional Metrics */}
          {isExpanded && (
            <div className="flex justify-center flex-wrap gap-4 text-sm border-t pt-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Avg I/O Wait:</span>
                <span className="font-semibold">
                  {isNaN(avgIOWait) ? "N/A" : `${avgIOWait.toFixed(2)}s`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Max Wait (Starvation):</span>
                <span className={`font-semibold ${starvationTime > 20 ? "text-red-600" : starvationTime > 10 ? "text-orange-600" : ""}`}>
                  {starvationTime === 0 ? "N/A" : `${starvationTime.toFixed(2)}s`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
