import { NextRequest, NextResponse } from "next/server";

import { db } from "@/utils/firebase/admins";

import { sendOTPEmail } from "@/utils/email/emailService";

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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = querySnapshot.docs[0].data();
    const displayName = userData.displayName || email.split("@")[0];

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store OTP in Firestore
    const otpRef = db.collection("otps").doc(email);
    await otpRef.set({
      otp,
      email,
      createdAt: new Date(),
      expiresAt: otpExpiry,
      attempts: 0,
    });

    // Send OTP via email
    try {
      await sendOTPEmail(email, otp, displayName);
    } catch (emailError) {
      // If email fails, delete the OTP and throw error
      await otpRef.delete();
      console.error("Email sending failed:", emailError);

      // For development, still log the OTP
      if (process.env.NODE_ENV === "development") {
        console.log(`OTP for ${email}: ${otp}`);
      }

      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    // For development, also log the OTP
    if (process.env.NODE_ENV === "development") {
      console.log(`OTP for ${email}: ${otp}`);
    }

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
