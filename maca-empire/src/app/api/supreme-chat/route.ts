import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Proxy to the Python FastAPI backend
    // Assuming it's running on localhost:8000 for local testing
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${pythonBackendUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // In production, pass the Authorization header from the incoming request
        'Authorization': req.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: unknown) {
    console.error('Unified API Error:', error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: 'Internal Server Error', message }, 
      { status: 500 }
    );
  }
}
