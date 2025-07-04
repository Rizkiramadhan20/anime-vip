import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth, db } from "@/utils/firebase/admins";

// Set session expiration to 5 days
const SESSION_EXPIRATION_DAYS = 5;

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * SESSION_EXPIRATION_DAYS * 1000; // 5 days in milliseconds
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000, // Convert to seconds
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
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

    // Get user data from Firestore
    try {
      const userDoc = await db
        .collection(process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string)
        .doc(decodedClaims.uid)
        .get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData) {
          return NextResponse.json({
            authenticated: true,
            uid: decodedClaims.uid,
            user: {
              uid: userData.uid,
              email: userData.email,
              displayName: userData.displayName,
              role: userData.role,
              days: userData.days,
              photoURL: userData.photoURL,
              emailVerified: userData.emailVerified || false,
              isActive: userData.isActive || true,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
            },
          });
        }
      }
    } catch (firestoreError) {
      console.error("Error fetching user data:", firestoreError);
      // If Firestore fails, still return basic auth info
      return NextResponse.json({
        authenticated: true,
        uid: decodedClaims.uid,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      uid: decodedClaims.uid,
      user: null,
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
