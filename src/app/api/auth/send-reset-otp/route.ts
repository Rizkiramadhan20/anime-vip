import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase/admins";
import { sendResetOTPEmail } from "@/utils/email/emailService";

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user to get displayName
    const usersRef = db.collection(
      process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string
    );
    const q = usersRef.where("email", "==", email);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    const userData = querySnapshot.docs[0].data();
    const displayName = userData.displayName || email.split("@")[0];

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store OTP in Firestore with prefix to distinguish from email verification OTPs
    const otpRef = db.collection("reset_otps").doc(email);
    await otpRef.set({
      otp,
      email,
      createdAt: new Date(),
      expiresAt: otpExpiry,
      attempts: 0,
    });

    // Send OTP via email
    try {
      await sendResetOTPEmail(email, otp, displayName);
    } catch (emailError) {
      // If email fails, delete the OTP and throw error
      await otpRef.delete();
      console.error("Email sending failed:", emailError);

      // For development, still log the OTP
      if (process.env.NODE_ENV === "development") {
        console.log(`Reset OTP for ${email}: ${otp}`);
      }

      return NextResponse.json(
        { error: "Failed to send reset OTP. Please try again." },
        { status: 500 }
      );
    }

    // For development, also log the OTP
    if (process.env.NODE_ENV === "development") {
      console.log(`Reset OTP for ${email}: ${otp}`);
    }

    return NextResponse.json(
      { message: "Reset OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send reset OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
