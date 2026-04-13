import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name } = body;

    const supabase = createServerClient();

    // Create new session (with or without name)
    const { data, error } = await supabase
      .from('sessions')
      .insert(name ? { name } : {})
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');
    const name = searchParams.get('name');

    const supabase = createServerClient();

    if (name) {
      // Search by name
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('name', name)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        return NextResponse.json({ exists: false });
      }

      return NextResponse.json({ exists: true, session: data });
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID or name required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to get session:', error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, currentSection, status, name } = body;

    const supabase = createServerClient();

    const updateData: Record<string, unknown> = {};
    if (currentSection !== undefined) updateData.current_section = currentSection;
    if (status !== undefined) updateData.status = status;
    if (name !== undefined) updateData.name = name;

    const { data, error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
