import { NextResponse } from 'next/server';

// 이 API 라우트는 사용하지 않습니다. 직접 FastAPI 백엔드와 통신합니다.
export async function GET() {
  return NextResponse.json(
    { 
      error: 'This route is deprecated. Please use the FastAPI backend directly.',
      redirectTo: 'http://localhost:8000/api/tools'
    },
    { status: 307 }
  );
} 