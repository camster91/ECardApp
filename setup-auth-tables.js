// Script to setup auth tables in Supabase
const SUPABASE_URL = 'https://vtbreowxqfcvwegpfnwn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0YnJlb3d4cWZjdndlZ3BmbnduIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDg0MDg1MywiZXhwIjoyMDg2NDE2ODUzfQ.hMz3csBglmYDkEgMV2yEWoUt2z_ieZP-IngoDzKc84I';

const sqlStatements = [
  // Create auth_codes table
  `CREATE TABLE IF NOT EXISTS auth_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT,
    phone TEXT,
    code TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'guest')),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT email_or_phone CHECK (
      (email IS NOT NULL AND phone IS NULL) OR 
      (email IS NULL AND phone IS NOT NULL)
    )
  );`,

  // Create admin_users table
  `CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // Create user_sessions table
  `CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_role TEXT NOT NULL CHECK (user_role IN ('admin', 'guest')),
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // Insert sample admin user
  `INSERT INTO admin_users (email, password, name) 
   VALUES ('admin@example.com', 'admin123', 'Admin User')
   ON CONFLICT (email) DO NOTHING;`
];

async function runSQL(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      console.error(`Error running SQL: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Network error: ${error.message}`);
    return false;
  }
}

async function setupTables() {
  console.log('Setting up authentication tables...');
  
  for (let i = 0; i < sqlStatements.length; i++) {
    console.log(`Running statement ${i + 1}/${sqlStatements.length}...`);
    const success = await runSQL(sqlStatements[i]);
    
    if (success) {
      console.log('✓ Statement executed successfully');
    } else {
      console.log('✗ Failed to execute statement');
      break;
    }
  }
  
  console.log('Setup complete!');
}

// Run the setup
setupTables().catch(console.error);