'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddProcessControlsProps {
  onAddProcess: (type: 'system' | 'user' | 'background') => void;
}

export function AddProcessControls({ onAddProcess }: AddProcessControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add Processes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => onAddProcess('system')} 
          className="w-full"
          variant="default"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add System Process
        </Button>
        
        <Button 
          onClick={() => onAddProcess('user')} 
          className="w-full"
          variant="secondary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User Process
        </Button>
        
        <Button 
          onClick={() => onAddProcess('background')} 
          className="w-full"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Background Process
        </Button>
      </CardContent>
    </Card>
  );
}
