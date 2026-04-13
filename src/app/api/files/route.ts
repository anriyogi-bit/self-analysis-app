import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sessionId = formData.get('sessionId') as string;
    const fileType = formData.get('fileType') as string;

    if (!file || !sessionId || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${sessionId}/${fileType}_${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('diagnosis-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Extract text from file if possible
    let extractedText = '';
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
      extractedText = await file.text();
    }
    // For PDF and images, we'd need OCR - for now, just store the file

    // Save file metadata to database
    const { error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        session_id: sessionId,
        file_type: fileType,
        file_name: file.name,
        storage_path: filePath,
        extracted_text: extractedText || null,
      });

    if (dbError) throw dbError;

    return NextResponse.json({ storagePath: filePath });
  } catch (error) {
    console.error('Failed to upload file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
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
      .from('uploaded_files')
      .select('*')
      .eq('session_id', sessionId);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to get files:', error);
    return NextResponse.json(
      { error: 'Failed to get files' },
      { status: 500 }
    );
  }
}
