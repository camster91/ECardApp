import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import twilio from 'twilio';

const resend = new Resend(process.env.RESEND_API_KEY!);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_API_KEY_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, email, phone, eventId } = body;

    if (!method || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Determine role
    let role = 'guest';
    if (method === 'email' && email) {
      // Check if this is an admin email
      const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (admin) {
        role = 'admin';
      }
    }

    // Store code in database
    const { error: dbError } = await supabase
      .from('auth_codes')
      .upsert({
        email: email || null,
        phone: phone || null,
        code,
        role,
        event_id: eventId,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to generate code' },
        { status: 500 }
      );
    }

    // Send code via appropriate channel
    if (method === 'email' && email) {
      const { error: emailError } = await resend.emails.send({
        from: 'ECardApp <noreply@ashbi.ca>',
        to: email,
        subject: role === 'admin' ? 'Your Admin Login Code' : 'Your Guest Access Code',
        html: generateEmailTemplate(code, role as 'admin' | 'guest', eventId)
      });

      if (emailError) {
        console.error('Email error:', emailError);
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }
    } else if (method === 'phone' && phone) {
      try {
        await twilioClient.messages.create({
          body: `Your ECardApp ${role} access code: ${code}. This code expires in 15 minutes.`,
          from: process.env.TWILIO_MESSAGING_SERVICE_SID!,
          to: phone
        });
      } catch (error) {
        console.error('SMS error:', error);
        return NextResponse.json(
          { error: 'Failed to send SMS' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Code sent to your ${method === 'email' ? 'email' : 'phone'}`,
      role
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateEmailTemplate(code: string, role: 'admin' | 'guest', eventId?: string): string {
  const isAdmin = role === 'admin';
  
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">ECardApp</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #374151; margin-top: 0;">
            ${isAdmin ? 'Your Admin Login Code' : 'Your Guest Access Code'}
          </h2>
          
          <div style="background: white; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #e5e7eb;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #374151; margin: 20px 0;">
              ${code}
            </div>
            <p style="color: #6b7280; margin: 0;">
              This code expires in 15 minutes
            </p>
          </div>
          
          <p style="color: #6b7280;">
            ${isAdmin 
              ? 'Enter this code on the login page to access your admin dashboard.' 
              : 'Enter this code on the event page to access guest features.'}
          </p>
          
          ${eventId ? `
            <p style="color: #6b7280;">
              Event ID: ${eventId}
            </p>
          ` : ''}
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 14px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
}