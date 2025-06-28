import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const usersRef = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string
    );
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // In a real implementation, you'd send a new verification email
    // For now, we'll simulate this
    // You can integrate with email services like SendGrid, AWS SES, etc.

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
