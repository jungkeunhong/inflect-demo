import { v4 as uuidv4 } from 'uuid';
import { Message } from './types';

// Function to create a grouped API key input message
export function createGroupedApiKeyMessage(services: string[]): Message {
  return {
    id: uuidv4(),
    role: "assistant",
    content: "To proceed, please provide API keys for the selected services",
    type: "api_keys_group",
    meta: {
      services
    },
    createdAt: new Date()
  };
}
