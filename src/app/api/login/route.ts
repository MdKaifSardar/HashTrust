import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/actions/user.actions";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
    }
    const result = await loginUser(email, password);
    if (result.ok && result.idToken) {
      return NextResponse.json({
        ok: true,
        idToken: result.idToken,
        message: result.message || "Login successful!",
      });
    } else {
      // Hide Firebase internal errors from frontend
      const isFirebaseInitError = result.error && result.error.toLowerCase().includes("default firebase app does not exist");
      return NextResponse.json({
        ok: false,
        error: isFirebaseInitError ? "Server error. Please try again later." : result.error || "Login failed.",
        message: isFirebaseInitError ? "Server error. Please try again later." : result.message || "Login failed.",
      }, { status: 401 });
    }
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err?.message || "Internal server error.",
      message: err?.message || "Internal server error.",
    }, { status: 500 });
  }
}
