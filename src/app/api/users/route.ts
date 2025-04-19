import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import User from "@/lib/db/models/User";

// Create user
export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();

  const { name, userName, email, bio, fileId } = body;

  try {
    const newUser = new User({
      name,
      userName,
      email,
      bio,
      fileId,
    });

    await newUser.save();
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}

export async function methodNotAllowed() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}
