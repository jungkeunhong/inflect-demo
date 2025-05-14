import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BarChart3, Database, FileText, Mail, MessageSquare, Search, Users, Activity, Layers } from "lucide-react"
import React from 'react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getToolIcon(tool: string) {
  switch (tool) {
    case "hubspot":
      return Users
    case "clearbit":
      return Search
    case "mixpanel":
      return BarChart3
    case "segmentation":
      return Database
    case "content":
      return FileText
    case "customerio":
      return Mail
    case "intercom":
      return MessageSquare
    case "tracker":
      return Activity
    default:
      return Layers
  }
}

export function getToolName(tool: string) {
  switch (tool) {
    case "hubspot":
      return "HubSpot"
    case "clearbit":
      return "Clearbit"
    case "mixpanel":
      return "Mixpanel"
    case "segmentation":
      return "Segmentation Engine"
    case "content":
      return "Content Recommendation"
    case "customerio":
      return "Customer.io"
    case "intercom":
      return "Intercom"
    case "tracker":
      return "Engagement Tracker"
    default:
      return tool
  }
}

export function getAgentSteps(agentId: string) {
  switch (agentId) {
    case "agent-a":
      return ["Detecting New Signup", "Enriching Data", "Building Profile"]
    case "agent-b":
      return ["Analyzing Profile", "Applying Segmentation Logic", "Selecting Content"]
    case "agent-c":
      return ["Preparing Email Sequence", "Configuring In-App Messages", "Setting Triggers"]
    default:
      return []
  }
}

// Tool interface components
import HubSpotInterface from "@/components/tools/hubspot-interface"
import ClearbitInterface from "@/components/tools/clearbit-interface"
import MixpanelInterface from "@/components/tools/mixpanel-interface"
import SegmentationInterface from "@/components/tools/segmentation-interface"
import ContentInterface from "@/components/tools/content-interface"
import CustomerioInterface from "@/components/tools/customerio-interface"
import IntercomInterface from "@/components/tools/intercom-interface"
import TrackerInterface from "@/components/tools/tracker-interface"

export function getToolInterface(tool: string, agentId: string): React.ComponentType<{ isActive: boolean }> {
  switch (tool) {
    case "hubspot":
      return HubSpotInterface
    case "clearbit":
      return ClearbitInterface
    case "mixpanel":
      return MixpanelInterface
    case "segmentation":
      return SegmentationInterface
    case "content":
      return ContentInterface
    case "customerio":
      return CustomerioInterface
    case "intercom":
      return IntercomInterface
    case "tracker":
      return TrackerInterface
    default:
      return ({ isActive }: { isActive: boolean }) => <div className="text-gray-500">Tool interface not available</div>
  }
}
