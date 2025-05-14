"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner"; // For user feedback

export interface ApiKeyInputProps {
  serviceName: string;
  onApiKeySubmit: (apiKey: string, serviceName: string) => void;
  description?: string;
  submitButtonText?: string;
}

export function ApiKeyInput({
  serviceName,
  onApiKeySubmit,
  description,
  submitButtonText = "Save API Key"
}: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("API Key cannot be empty.");
      return;
    }
    onApiKeySubmit(apiKey, serviceName);
    toast.success(`${serviceName} API Key submitted (locally).`); // Update message if it's actually saved somewhere
    setApiKey(""); // Clear after submit
  };

  return (
    <Card className="w-full shadow-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-3">
          <Input 
            id={`api-key-${serviceName}`}
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={`Your ${serviceName} API Key`}
            className="w-full"
          />
           <p className="text-xs text-muted-foreground">
            Your API key will be handled securely.
          </p>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!apiKey.trim()} className="w-full">
            {submitButtonText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
