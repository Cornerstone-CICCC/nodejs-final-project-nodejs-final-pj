import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { signUp, createSessionToken } from "@/lib/auth";
import { NotificationSettings } from "@/lib/db/models/NotificationSettings";

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
      name: "session-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
    });

    // Create a notification settings
    const newNotificationSetting = new NotificationSettings({
      userId: user._id,
    });
    await newNotificationSetting.save();

    // Return user info to the client for zustand state management (without password)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id.toString(),
          email: user.email,
          userName: user.userName || "",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    // ZodError handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid email and password (minimum 8 characters)",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    // MongoDB error handling
    if (error instanceof Error && "code" in error && error.code === 11000) {
      interface MongoDBError extends Error {
        code: number;
        keyValue?: Record<string, unknown>;
      }

      const keyValue = (error as MongoDBError).keyValue || {};

      if ("email" in keyValue) {
        return NextResponse.json(
          {
            success: false,
            message: "This email is already registered",
          },
          { status: 400 }
        );
      }

      if ("fileId" in keyValue) {
        return NextResponse.json(
          {
            success: false,
            message: "Account creation failed. Please try again later",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Some information is already registered",
        },
        { status: 400 }
      );
    }

    // Known error messages
    if (error instanceof Error) {
      if (error.message === "Email already exists") {
        return NextResponse.json(
          {
            success: false,
            message: "This email is already registered",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Failed to create account. Please check your information",
        },
        { status: 400 }
      );
    }

    // Unexpected errors
    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred. Please try again later",
      },
      { status: 500 }
    );
  }
}
