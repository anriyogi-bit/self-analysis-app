import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, section, responses } = body;

    const supabase = createServerClient();

    // Upsert each response
    const upsertPromises = Object.entries(responses).map(([questionId, answer]) => {
      return supabase
        .from('responses')
        .upsert(
          {
            session_id: sessionId,
            section,
            question_id: questionId,
            answer: JSON.stringify(answer),
          },
          {
            onConflict: 'session_id,section,question_id',
          }
        );
    });

    await Promise.all(upsertPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save responses:', error);
    return NextResponse.json(
      { error: 'Failed to save responses' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const section = searchParams.get('section');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    let query = supabase
      .from('responses')
      .select('*')
      .eq('session_id', sessionId);

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Convert to key-value format
    const responses: Record<string, Record<string, string | string[]>> = {};
    data.forEach((row) => {
      if (!responses[row.section]) {
        responses[row.section] = {};
      }
      try {
        responses[row.section][row.question_id] = JSON.parse(row.answer);
      } catch {
        responses[row.section][row.question_id] = row.answer;
      }
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error('Failed to get responses:', error);
    return NextResponse.json(
      { error: 'Failed to get responses' },
      { status: 500 }
    );
  }
}
