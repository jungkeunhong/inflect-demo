import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// 이 API 라우트는 사용하지 않습니다. 직접 FastAPI 백엔드와 통신합니다.
export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    // FastAPI 백엔드로 요청 전송
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    // 스트리밍 응답을 그대로 전달
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 