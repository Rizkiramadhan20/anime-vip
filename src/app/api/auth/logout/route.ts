
import { NextResponse } from "next/server";
import { auth } from "@/utils/firebase/admins";
import { cookies } from "next/headers";

// Set session expiration to 5 days
const SESSION_EXPIRATION_DAYS = 5;

export async function POST() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}

// Endpoint to verify session and get user data
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    return NextResponse.json({
      authenticated: true,
      uid: decodedClaims.uid,
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
