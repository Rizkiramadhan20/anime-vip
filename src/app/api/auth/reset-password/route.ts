import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/utils/firebase/admins";

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Get stored OTP from Firestore
    const otpRef = db.collection("reset_otps").doc(email);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      return NextResponse.json(
        { error: "OTP not found or expired" },
        { status: 404 }
      );
    }

    const otpData = otpDoc.data();

    if (!otpData) {
      return NextResponse.json({ error: "Invalid OTP data" }, { status: 400 });
    }

    // Check if OTP is expired
    if (new Date() > otpData.expiresAt.toDate()) {
      await otpRef.delete();
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Check if too many attempts
    if (otpData.attempts >= 3) {
      await otpRef.delete();
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      // Increment attempts
      await otpRef.update({
        attempts: otpData.attempts + 1,
      });
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Find user by email
    const usersRef = db.collection(
      process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string
    );
    const q = usersRef.where("email", "==", email);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Update password in Firebase Auth
    try {
      // Get user by email from Firebase Auth
      const userRecord = await auth.getUserByEmail(email);

      // Update password
      await auth.updateUser(userRecord.uid, {
        password: newPassword,
      });
    } catch (authError) {
      console.error("Error updating password in Firebase Auth:", authError);
      return NextResponse.json(
        { error: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    // Update user's updatedAt in Firestore
    await userDoc.ref.update({
      updatedAt: new Date(),
    });

    // Delete the OTP after successful reset
    await otpRef.delete();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
