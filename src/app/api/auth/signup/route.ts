import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { z } from "zod";
import { signUp, createSessionToken } from "@/lib/auth";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = signupSchema.parse(body);

    // Create a new user
    const user = await signUp(email, password);

    // Create a session token
    const token = await createSessionToken(user.id.toString());

    // Store the session token in cookies
    const cookiesStore = await cookies();
    cookiesStore.set({
      name: 'session-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 1 day
    });

    // Return user info to the client for zustand state management (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id.toString(),
        email: user.email,
        userName: user.userName || '',
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 });
    }

    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}