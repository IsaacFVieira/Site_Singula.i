import { NextRequest, NextResponse } from 'next/server';
import { callSingularChat, OpenRouterMessage } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  // Validate API key server-side
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: 'OPENROUTER_API_KEY is not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { message, history = [], language = 'pt' } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Convert history to OpenRouter format
    const conversationHistory: OpenRouterMessage[] = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Call OpenRouter with Singular system prompt
    const result = await callSingularChat(
      message,
      conversationHistory,
      process.env.OPENROUTER_API_KEY
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Failed to process message',
          response: result.response,
          source: result.source
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: result.response,
      source: result.source,
      success: result.success
    });

  } catch (error) {
    console.error('Error in chat API:', error);

    return NextResponse.json(
      {
        error: 'Failed to process message',
        response: 'Desculpa, ocorreu um erro ao processar a tua pergunta. Tenta novamente mais tarde.',
        source: 'openrouter'
      },
      { status: 500 }
    );
  }
}
