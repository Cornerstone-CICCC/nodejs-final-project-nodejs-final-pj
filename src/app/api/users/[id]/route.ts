import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import User from "@/lib/db/models/User";

// Update user
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    await dbConnect();
    
    const body = await req.json();
    const { name, userName, email, bio, fileId } = body;

    const existingUser = await User.findOne({ userName })
    if (existingUser && existingUser._id.toString() !== id) {
      return NextResponse.json(
        { success: false, message: "Username is already taken"},
        { status: 400 }
      )
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, userName, email, bio, fileId },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}