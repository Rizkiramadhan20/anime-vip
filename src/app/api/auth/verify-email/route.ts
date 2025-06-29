import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase/admins";
import { sendWelcomeEmail } from "@/utils/email/emailService";

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
    const otpRef = db
      .collection(process.env.NEXT_PUBLIC_COLLECTIONS_OTPS as string)
      .doc(email);
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

    // Update user's emailVerified status
    await userDoc.ref.update({
      emailVerified: true,
      updatedAt: new Date(),
    });

    // Delete the OTP after successful verification
    await otpRef.delete();

    // Send welcome email (don't wait for it to complete)
    sendWelcomeEmail(email, userData.displayName).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
