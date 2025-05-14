"use client";

import React from 'react';
import { Input } from '@/components/ui/input';

type ApiKeyEntryRowProps = {
  serviceName: string;
  value: string;
  onValueChange: (apiKey: string) => void;
  placeholder?: string;
};

export function ApiKeyEntryRow({ 
  serviceName, 
  value, 
  onValueChange, 
  placeholder 
}: ApiKeyEntryRowProps) {
  return (
    <div className="flex items-center space-x-2 py-1 w-full">
      <Input
        id={`api-key-row-${serviceName}`}
        type="password"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder || `Your ${serviceName} API Key`}
        className="flex-grow"
        aria-label={`${serviceName} API Key`}
      />
      {/* Individual submit button removed */}
    </div>
  );
}
