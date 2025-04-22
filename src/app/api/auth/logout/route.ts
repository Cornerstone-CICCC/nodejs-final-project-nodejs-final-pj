import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import userModel from "@/lib/db/models/User";
import mongoose from "mongoose";

export async function POST() {
  const cookiesStore = await cookies();
  const userId = cookiesStore.get("user-id")?.value;

  if (userId) {
    userModel
      .updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { lastLogin: new Date(), isLoggedIn: false }
      )
      .then((updatedUser) => {
        console.log("User last login updated:", updatedUser);
      })
      .catch((error) => {
        console.error("Error updating user last login:", error);
      });
  }

  cookiesStore.delete("session-token");

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
