import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer then to Buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate magic bytes to prevent spoofed content types
    const header = buffer.slice(0, 8);
    const magicValid =
      (file.type === 'image/jpeg' && header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF) ||
      (file.type === 'image/png' && header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) ||
      (file.type === 'image/gif' && header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) ||
      (file.type === 'image/webp' && header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) ||
      (file.type === 'image/svg+xml');

    if (!magicValid) {
      return NextResponse.json(
        { error: 'File content does not match declared type' },
        { status: 400 }
      );
    }

    // Extract file extension
    const originalName = file.name;
    const ext = originalName.split('.').pop() || 'png';
    const fileName = `${nanoid()}.${ext}`;
    const filePath = `${user.id}/${fileName}`;

    // Use admin client for storage (bypasses RLS; auth is checked above)
    const adminSupabase = createAdminClient();

    const { error: uploadError } = await adminSupabase.storage
      .from('event-designs')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = adminSupabase.storage
      .from('event-designs')
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
