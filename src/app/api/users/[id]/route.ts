import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import User from "@/lib/db/models/User";

// Update user
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = (await params).id;

  try {
    await dbConnect();

    const body = await req.json();
    const { name, userName, email, bio, fileId } = body;

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
      { success: false, message: error },
      { status: 500 }
    );
  }
}
