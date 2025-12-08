'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";
import { MIN_SIMULATION_SPEED, MAX_SIMULATION_SPEED } from "@/lib/constants";

interface SimulationControlsProps {
  isPaused: boolean;
  simulationSpeed: number;
  onPauseToggle: () => void;
  onSpeedChange: (speed: number) => void;
}

export function SimulationControls({ 
  isPaused, 
  simulationSpeed, 
  onPauseToggle, 
  onSpeedChange 
}: SimulationControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Simulation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button 
            onClick={onPauseToggle} 
            className="w-full"
            variant={isPaused ? "default" : "secondary"}
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
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Simulation Speed
            </label>
            <span className="text-sm text-muted-foreground">
              {simulationSpeed.toFixed(1)}x
            </span>
          </div>
          <Slider
            value={[simulationSpeed]}
            onValueChange={(values) => onSpeedChange(values[0])}
            min={MIN_SIMULATION_SPEED}
            max={MAX_SIMULATION_SPEED}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{MIN_SIMULATION_SPEED}x</span>
            <span>{MAX_SIMULATION_SPEED}x</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
