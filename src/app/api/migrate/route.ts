import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// This is a one-time migration endpoint
// DELETE THIS FILE AFTER RUNNING

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    return (error as { code: string }).code;
  }
  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    // Simple security check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.MIGRATION_SECRET || 'migrate-now'}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    
    console.log('Starting database migration...');
    
    const createAuthCodes = `
      CREATE TABLE IF NOT EXISTS auth_codes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT,
        phone TEXT,
        code TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'guest')),
        event_id UUID,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT email_or_phone CHECK (
          (email IS NOT NULL AND phone IS NULL) OR 
          (email IS NULL AND phone IS NOT NULL)
        )
      );
    `;
    
    const createAdminUsers = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    
    const createUserSessions = `
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL,
        user_role TEXT NOT NULL CHECK (user_role IN ('admin', 'guest')),
        session_token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }
    
    const sqlStatements = [
      createAuthCodes,
      createAdminUsers,
      createUserSessions,
      `INSERT INTO admin_users (email, password, name) 
       VALUES ('admin@example.com', 'admin123', 'Admin User')
       ON CONFLICT (email) DO NOTHING;`,
      `CREATE INDEX IF NOT EXISTS idx_auth_codes_email_code ON auth_codes(email, code) WHERE email IS NOT NULL;`,
      `CREATE INDEX IF NOT EXISTS idx_auth_codes_phone_code ON auth_codes(phone, code) WHERE phone IS NOT NULL;`,
      `CREATE INDEX IF NOT EXISTS idx_auth_codes_expires ON auth_codes(expires_at);`,
      `CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);`,
      `CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);`
    ];
    
    const results = [];
    
    for (const sql of sqlStatements) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_net_exec`, {
          method: 'POST',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ query: sql })
        });
        
        results.push({
          sql: sql.substring(0, 50) + '...',
          status: response.status,
          success: response.ok
        });
        
      } catch (error: unknown) {
        results.push({
          sql: sql.substring(0, 50) + '...',
          error: getErrorMessage(error),
          success: false
        });
      }
    }
    
    const testResults = [];
    
    // Test auth_codes
    try {
      const { error } = await supabase
        .from('auth_codes')
        .insert({
          email: 'test@example.com',
          code: '123456',
          role: 'admin',
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        });
      
      testResults.push({
        table: 'auth_codes',
        exists: !error || error.code !== '42P01',
        error: error?.message
      });
      
      if (!error) {
        await supabase.from('auth_codes').delete().eq('email', 'test@example.com');
      }
    } catch (error: unknown) {
      testResults.push({
        table: 'auth_codes',
        exists: false,
        error: getErrorMessage(error)
      });
    }
    
    // Test admin_users
    try {
      const { error } = await supabase
        .from('admin_users')
        .select('count')
        .limit(1);
      
      testResults.push({
        table: 'admin_users',
        exists: !error || error.code !== '42P01',
        error: error?.message
      });
    } catch (error: unknown) {
      testResults.push({
        table: 'admin_users',
        exists: false,
        error: getErrorMessage(error)
      });
    }
    
    return NextResponse.json({
      message: 'Migration attempted',
      sqlResults: results,
      tableTests: testResults,
      success: testResults.some(t => t.exists),
      note: 'If tables were not created, run SQL manually in Supabase SQL Editor'
    });
    
  } catch (error: unknown) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = await createClient();
  
  const tables = ['auth_codes', 'admin_users', 'user_sessions'];
  const results = [];
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      results.push({
        table,
        exists: !error || error.code !== '42P01',
        error: error?.message
      });
    } catch (error: unknown) {
      results.push({
        table,
        exists: false,
        error: getErrorMessage(error)
      });
    }
  }
  
  return NextResponse.json({
    tables: results,
    allExist: results.every(r => r.exists),
    instructions: results.every(r => r.exists) 
      ? 'All tables exist! Authentication system is ready.'
      : 'Some tables are missing. Run migration or execute SQL manually.'
  });
}
