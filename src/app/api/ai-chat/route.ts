import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const systemPrompt = `You are an AI-powered HR assistant for an enterprise HRMS platform called "NEXUS HRMS". 
You help with HR-related queries including:
- Employee management and policies
- Leave and attendance queries
- Payroll and compensation questions
- Recruitment and hiring processes
- Performance management
- Learning and development
- Company policies and compliance
- General workplace queries

You are professional, helpful, and knowledgeable about HR best practices.
Keep responses concise but informative. Use bullet points for lists.
If you don't know something specific, suggest the user contact their HR department.

Context: ${context || 'General HR query'}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || 'I apologize, but I was unable to process your request. Please try again.';

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('AI Chat error:', errMsg);
    return NextResponse.json(
      { reply: 'I\'m currently experiencing high demand. Please try again in a moment, or contact your HR department for immediate assistance.' },
      { status: 200 }
    );
  }
}
