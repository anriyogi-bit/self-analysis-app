import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { analyzeResponses } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get all responses for this session
    const { data: responsesData, error: responsesError } = await supabase
      .from('responses')
      .select('*')
      .eq('session_id', sessionId);

    if (responsesError) throw responsesError;

    // Convert to structured format
    const responses: Record<string, Record<string, string | string[]>> = {};
    responsesData.forEach((row) => {
      if (!responses[row.section]) {
        responses[row.section] = {};
      }
      try {
        responses[row.section][row.question_id] = JSON.parse(row.answer);
      } catch {
        responses[row.section][row.question_id] = row.answer;
      }
    });

    // Get uploaded files
    const { data: filesData, error: filesError } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('session_id', sessionId);

    if (filesError) throw filesError;

    // Get extracted text from files
    const diagnosisTexts = filesData
      .filter((f) => f.extracted_text)
      .map((f) => `[${f.file_type}] ${f.extracted_text}`);

    // Run analysis with Claude
    const analysis = await analyzeResponses(responses, diagnosisTexts);

    // Save analysis result
    const { error: saveError } = await supabase
      .from('analysis_results')
      .insert({
        session_id: sessionId,
        analysis_json: analysis,
      });

    if (saveError) throw saveError;

    // Update session status
    await supabase
      .from('sessions')
      .update({ status: 'analyzed' })
      .eq('id', sessionId);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Failed to analyze:', error);
    return NextResponse.json(
      { error: 'Failed to analyze responses' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return NextResponse.json(data.analysis_json);
  } catch (error) {
    console.error('Failed to get analysis:', error);
    return NextResponse.json(
      { error: 'No analysis found' },
      { status: 404 }
    );
  }
}
