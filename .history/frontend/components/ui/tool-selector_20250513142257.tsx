"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ToolSelectorProps {
  availableTools: string[];
  onToolSelect: (selectedTools: string[]) => void;
  title?: string;
  submitButtonText?: string;
}

export function ToolSelector({
  availableTools,
  onToolSelect,
  title = "Select Tools",
  submitButtonText = "Confirm Selection"
}: ToolSelectorProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const toggleTool = (tool: string) => {
    setSelectedTools(prev => 
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const handleSubmit = () => {
    onToolSelect(selectedTools);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Choose the tools or data sources you'd like to connect.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {availableTools.map(tool => (
            <Button
              key={tool}
              variant={selectedTools.includes(tool) ? "default" : "outline"}
              onClick={() => toggleTool(tool)}
              className="w-full justify-start text-left h-auto py-2 px-3 whitespace-normal break-words"
            >
              {selectedTools.includes(tool) && <Check className="mr-2 h-4 w-4 flex-shrink-0" />}
              <span className="flex-1">{tool}</span>
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={selectedTools.length === 0}
          className="w-full"
        >
          {submitButtonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
