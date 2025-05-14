import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { type Message } from "@/lib/types"
import { createGroupedApiKeyMessage } from '@/lib/api-utils'

export interface UseApiKeysOptions {
  onAllKeysSubmitted?: (selectedTools: string[]) => void
}

export function useApiKeys({ onAllKeysSubmitted }: UseApiKeysOptions = {}) {
  const [pendingServices, setPendingServices] = useState<string[]>([])
  const [submittedServices, setSubmittedServices] = useState<string[]>([])
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [allKeysSubmitted, setAllKeysSubmitted] = useState(false)
  
  const createGroupedApiKeyMessage = useCallback((services: string[]): Message => {
    // 여러 API 키를 한 번에 입력받기 위한 그룹 메시지를 생성합니다.
    console.log('Setting pending services:', services);
    setPendingServices(services)
    setSelectedTools(services)
    setAllKeysSubmitted(false)
    
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "To proceed, please provide API keys for the selected services",
      type: "api_keys_group",
      meta: {
        services
      },
      createdAt: new Date()
    }
  }, [])
  
  const markKeyAsSubmitted = useCallback((service: string) => {
    console.log(`Marking ${service} as submitted`);
    
    setSubmittedServices(prev => {
      const newSubmittedServices = [...prev, service]
      return newSubmittedServices
    })
  }, [])
  
  // 별도의 useEffect에서 모든 키가 제출되었는지 확인하고 콜백 실행
  useEffect(() => {
    // 콜백이 없거나 pendingServices가 없으면 리턴
    if (!onAllKeysSubmitted || pendingServices.length === 0) return;
    
    const allSubmitted = pendingServices.every(s => submittedServices.includes(s)) && 
                        pendingServices.length === submittedServices.length;
    
    console.log('Checking if all keys submitted:', {
      pendingServices,
      submittedServices,
      allSubmitted,
      selectedTools
    });
    
    if (allSubmitted && !allKeysSubmitted) {
      console.log('All API keys submitted, calling onAllKeysSubmitted with:', selectedTools);
      setAllKeysSubmitted(true);
      
      // 모든 키가 제출되었으면 콜백 실행 (약간의 지연 추가)
      setTimeout(() => {
        onAllKeysSubmitted(selectedTools);
      }, 500);
    }
  }, [pendingServices, submittedServices, selectedTools, onAllKeysSubmitted, allKeysSubmitted]);
  
  const resetKeyTracking = useCallback(() => {
    console.log('Resetting key tracking');
    setPendingServices([])
    setSubmittedServices([])
    setSelectedTools([])
    setAllKeysSubmitted(false)
  }, [])
  
  return {
    createGroupedApiKeyMessage,
    markKeyAsSubmitted,
    resetKeyTracking,
    isPending: (service: string) => pendingServices.includes(service),
    isSubmitted: (service: string) => submittedServices.includes(service),
    pendingServices,
    submittedServices
  }
} 