import { type Message, type Agent } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

// Mock data for agents
export const mockAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Root Agent",
    description: "Coordinates the entire workflow and handles initial data retrieval",
    tools: ["Google Sheets"],
    status: "idle",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "agent-2",
    name: "Analyst Agent",
    description: "Segments customers and determines appropriate strategies",
    tools: [],
    status: "idle",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "agent-3",
    name: "Storyline Agent",
    description: "Creates tailored onboarding sequences for each segment",
    tools: ["Google Docs"],
    status: "idle",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock tools
export const mockTools: string[] = [
  "Intercom",
  "Mixpanel",
  "Hubspot",
  "Looker",
  "Google Analytics",
  "Amplitude",
  "Segment",
  "Klaviyo", 
  "Slack",
  "Retool"
];

// Initial user prompt - automatically inserted as first message
export const initialUserPrompt: Message = {
  id: uuidv4(),
  role: "user",
  content: "I want to build an agent that detects and prevents churn",
  createdAt: new Date()
};

// Initial AI response
export const welcomeMessage: Message = {
  id: uuidv4(),
  role: "assistant",
  content: "Great! Here's a draft agent setup:\nRoot → Detect → Plan → Act\n\n1. Root Agent\nTriggers when retention metrics drop. Pulls user data across tools (Mixpanel, Hubspot, Segment).\n\n2. Detect Agent\nSpots silent churn—users who stop using, but don’t cancel yet. Flags them before it’s too late.\n\n3. Plan Agent\nAuto-generates win-back flows: free trials, reactivation emails, or Slack alerts—customized by segment.\n\n4. Act Agent\nExecutes across channels. Sends offers via email, notifies CSMs in Slack, or triggers Retool dashboards.\n\nShall we proceed?",
  createdAt: new Date()
};

// More detailed conversational steps for the demo
export const demoConversationSteps: Array<() => Omit<Message, 'id' | 'createdAt'>> = [
  () => ({ // Step 1: After initial greeting, ask for tools
    role: "assistant",
    content: "What are your favorite tools for customer retention?",
    type: "tool_selection",
    meta: { services: mockTools } // Ensure mockTools is defined and imported if in a different scope
  }),
  () => ({ // Step 2: After tool selection, confirm and ask for API keys if needed
    role: "assistant",
    content: "One last step! Please enter your API keys below. Just in case, I’ve linked the help docs for each one 😉
",
    // This step might dynamically change based on selected tools. For a demo, we can make it generic
    // or assume a common tool like HubSpot needs a key.
    type: "api_keys_group", // This assumes a generic API key request or a specific one
    meta: { services: ["HubSpot"] } // Example: Ask for HubSpot key
  }),
  () => ({ // Step 3: After API keys (or if none needed), confirm and suggest next steps
    role: "assistant",
    content: "Great, all set up! I'm now ready to start designing the agent logic. Based on your goal, I'll create a sequence of actions."
  }),
  () => ({ // Step 4: Agent design complete (simulated)
    role: "assistant",
    content: "I've designed the agent flow. Here's a visualization. You can now test or deploy it."
    // At this point, the AgentVisualizationContainer might become visible
  }),
  // Add more steps as needed for the demo flow
];
