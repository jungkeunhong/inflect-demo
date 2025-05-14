import type { Message } from "./types"

export const buildMessages: Message[] = [
  {
    id: "user-1",
    role: "user",
    content:
      "I need to build a customer onboarding workflow. When a new user signs up in HubSpot, I want to automatically create their profile in our analytics system, segment them based on company size and industry, then send a personalized welcome email sequence.",
  },
  {
    id: "assistant-1",
    role: "assistant",
    content:
      "I'll help you build this multi-agent workflow. Let me suggest a 3-step agent system that would work for your needs:\n\n**Agent A: Data Collection & Enrichment**\nThis agent will monitor HubSpot for new signups, enrich the data with additional information, and create profiles in your analytics system.\n\n**Agent B: Segmentation & Analysis**\nThis agent will analyze the enriched customer profiles, segment them based on criteria like company size and industry, and determine the best content approach.\n\n**Agent C: Personalized Communication**\nThis agent will create and deliver personalized communications across your channels based on the segmentation.\n\nHow does this overall flow sound to you?",
  },
  {
    id: "user-2",
    role: "user",
    content: "That sounds perfect!",
  },
  {
    id: "assistant-2",
    role: "assistant",
    content:
      "Great! Let's configure each agent. Starting with Agent A: Which analytics platform would you like to use for creating customer profiles?",
  },
  {
    id: "user-3",
    role: "user",
    content: "We use Mixpanel for analytics and Clearbit for data enrichment",
  },
  {
    id: "assistant-3",
    role: "assistant",
    content:
      "Perfect. Agent A will use these tools together:\n1. HubSpot - to monitor for new signups\n2. Clearbit - to enrich the customer data\n3. Mixpanel - to create comprehensive profiles\n\nFor Agent B: What specific segmentation criteria would you like to use?",
  },
  {
    id: "user-4",
    role: "user",
    content: "Company size (SMB, Mid-Market, Enterprise) and industry (Tech, Healthcare, Finance, Other)",
  },
  {
    id: "assistant-4",
    role: "assistant",
    content:
      "Got it. Agent B will use:\n1. Mixpanel - to access the customer data\n2. Custom Segmentation Engine - to apply your segmentation rules\n3. Content Recommendation System - to match content to segments\n\nFinally, for Agent C: What communication platforms do you use?",
  },
  {
    id: "user-5",
    role: "user",
    content: "We use Customer.io for email sequences and Intercom for in-app messages",
  },
  {
    id: "assistant-5",
    role: "assistant",
    content:
      "Excellent. Agent C will use:\n1. Customer.io - for email sequences\n2. Intercom - for in-app messaging\n3. Engagement Tracker - to monitor response and adjust strategy\n\nNow I need to connect to these services. Can you provide your API keys or authentication details for each tool?\n\n- HubSpot API Key:\n- Clearbit API Key:\n- Mixpanel API Key:\n- Customer.io API Key:\n- Intercom API Key:",
  },
  {
    id: "user-6",
    role: "user",
    content:
      "HubSpot: hub_1234key, Clearbit: cb_api98765, Mixpanel: mp_7583key, Customer.io: cio_key4672, Intercom: ic_4827api",
  },
  {
    id: "assistant-6",
    role: "assistant",
    content: "Thank you! I'm now connecting to your services and building your custom onboarding workflow...",
  },
  {
    id: "assistant-7",
    role: "assistant",
    content:
      "I've successfully connected all your services and built your multi-agent workflow! You can see the full system in the right panel. Would you like to test it with a sample customer?",
  },
]

export const testMessages: Message[] = [
  {
    id: "user-1",
    role: "user",
    content: "Let's test this workflow with a sample new customer",
  },
  {
    id: "assistant-1",
    role: "assistant",
    content: "Running the onboarding workflow for sample customer: TechCorp Inc.",
  },
  {
    id: "assistant-2",
    role: "assistant",
    content:
      "**Agent A is processing data:**\n- Detected new signup in HubSpot for 'tech@techcorp.com'\n- Enriching with Clearbit: Found company size (150 employees), industry (Technology), funding ($28M Series B)\n- Creating Mixpanel profile with 15 data points including firmographics and initial interest signals",
  },
  {
    id: "assistant-3",
    role: "assistant",
    content:
      "**Agent B is analyzing and segmenting:**\n- Categorized as: Mid-Market Tech Company\n- Identified highest value features: API Integration, Team Collaboration, Performance Analytics\n- Selected content track: 'Tech Growth' with focus on scaling use cases",
  },
  {
    id: "assistant-4",
    role: "assistant",
    content:
      "**Agent C is preparing communications:**\n- Created 5-part email sequence in Customer.io tailored to Mid-Market Tech segment\n- Scheduled welcome in-app message via Intercom highlighting API features\n- Set up engagement tracking to adjust future communications",
  },
  {
    id: "assistant-5",
    role: "assistant",
    content: "The complete workflow has been executed. You can see the detailed process in the right panel.",
  },
]
