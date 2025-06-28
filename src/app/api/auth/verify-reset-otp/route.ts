import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase/admins";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
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

    // OTP is valid - mark as verified but don't delete yet (will be deleted after password reset)
    await otpRef.update({
      verified: true,
      verifiedAt: new Date(),
    });

    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
