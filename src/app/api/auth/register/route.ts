import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields based on account type
    const requiredFields = {
      common: ['username', 'email', 'password', 'first_name', 'last_name', 'phone_number'],
      client: ['company_name', 'industry', 'services_required'],
      freelancer: ['profile_title', 'technical_skills', 'experience_level'],
    };

    // Check common required fields
    const missingFields = requiredFields.common.filter(field => !body[field]);
    
    // Check account type specific fields
    const accountTypeFields = requiredFields[body.account_type as keyof typeof requiredFields];
    if (accountTypeFields) {
      missingFields.push(...accountTypeFields.filter(field => !body[field]));
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Password strength validation
    if (body.password.length < 8) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 8 characters long' 
        },
        { status: 400 }
      );
    }

    // TODO: Add your actual registration logic here
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store in database
    // 4. Generate authentication tokens
    // 5. Send welcome email

    // For now, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: 'generated-user-id',
        username: body.username,
        email: body.email,
        account_type: body.account_type,
        // Add other relevant user data but exclude sensitive information
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}