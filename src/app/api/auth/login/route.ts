import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { signIn, createSessionToken } from "@/lib/auth";
import userModel from "@/lib/db/models/User";
import mongoose from "mongoose";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // User authentication
    const user = await signIn(email, password);

    // Create session token
    const token = await createSessionToken(user.id.toString());

    // Store session token in cookies
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

    cookiesStore.set({
      name: "user-id",
      value: user.id.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
    });

    userModel
      .updateOne(
        { _id: new mongoose.Types.ObjectId(user.id) },
        { lastLogin: new Date(), isLoggedIn: true }
      )
      .then((updatedUser) => {
        console.log("User last login updated:", updatedUser);
      })
      .catch((error) => {
        console.error("Error updating user last login:", error);
      });

    // Return user data to the client for zustand state management
    return NextResponse.json({
      success: true,
      user: {
        id: user.id.toString(),
        name: user.name || "",
        userName: user.userName || "",
        email: user.email,
        bio: user.bio || "",
        fileId: user.fileId || "",
        lastLogin: user.lastLogin || null,
        isLoggedIn: true,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Your email or password is incorrect. Please try again.",
      },
      { status: 401 }
    );
  }
}
