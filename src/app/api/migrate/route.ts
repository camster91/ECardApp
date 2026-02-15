import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// This is a one-time migration endpoint
// DELETE THIS FILE AFTER RUNNING

export async function POST(request: NextRequest) {
  try {
    // Simple security check - you could add a secret token here
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.MIGRATION_SECRET || 'migrate-now'}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    
    console.log('Starting database migration...');
    
    // Create auth_codes table
    console.log('Creating auth_codes table...');
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
    
    // Create admin_users table
    console.log('Creating admin_users table...');
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
    
    // Create user_sessions table
    console.log('Creating user_sessions table...');
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
    
    // We can't execute raw SQL directly, but we can try to insert data
    // which might auto-create tables in some cases
    
    // Instead, let's try to use the Supabase REST API to execute SQL
    // We'll make HTTP requests to the Supabase REST API
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }
    
    // Try to execute SQL via REST API
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
        // Try to execute via pg_net extension if available
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
        
      } catch (error) {
        results.push({
          sql: sql.substring(0, 50) + '...',
          error: error.message,
          success: false
        });
      }
    }
    
    // Check if tables were created by trying to insert test data
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
      
      // Clean up test data
      if (!error) {
        await supabase.from('auth_codes').delete().eq('email', 'test@example.com');
      }
    } catch (error) {
      testResults.push({
        table: 'auth_codes',
        exists: false,
        error: error.message
      });
    }
    
    // Test admin_users
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('count')
        .limit(1);
      
      testResults.push({
        table: 'admin_users',
        exists: !error || error.code !== '42P01',
        error: error?.message
      });
    } catch (error) {
      testResults.push({
        table: 'admin_users',
        exists: false,
        error: error.message
      });
    }
    
    return NextResponse.json({
      message: 'Migration attempted',
      sqlResults: results,
      tableTests: testResults,
      success: testResults.some(t => t.exists),
      note: 'If tables were not created, run SQL manually in Supabase SQL Editor'
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Also provide a GET endpoint to check status
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
    } catch (error) {
      results.push({
        table,
        exists: false,
        error: error.message
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