import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/actions/user.actions";
import { verifyApiKey, recordApiKeyUsage } from "@/lib/actions/apikey.actions";

export async function POST(req: NextRequest) {
  let reqBody: any = {};
  let apiKey: string = "";
  let type: string = "login";
  try {
    reqBody = await req.json();
    apiKey = reqBody.apiKey || "";
    type = reqBody.type || "login";
    const { email, password } = reqBody;

    if (!email || !password) {
      // Record usage for missing email or password
      await recordApiKeyUsage(
        apiKey,
        type,
        reqBody,
        { ok: false, error: "Email and password are required." },
        false,
        400
      );
      return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
    }
    if (!apiKey) {
      // Record usage for missing API key
      await recordApiKeyUsage(
        apiKey,
        type,
        reqBody,
        { ok: false, error: "API Key is required." },
        false,
        400
      );
      return NextResponse.json({ ok: false, error: "API Key is required." }, { status: 400 });
    }
    const apiKeyRes = await verifyApiKey(apiKey);

    if (!apiKeyRes.ok) {
      await recordApiKeyUsage(
        apiKey,
        type,
        reqBody,
        { ok: false, error: apiKeyRes.message || "Invalid API Key." },
        false,
        401
      );
      return NextResponse.json({ ok: false, error: apiKeyRes.message || "Invalid API Key." }, { status: 401 });
    }

    // API key is valid, proceed with login and record usage
    const result = await loginUser(reqBody.email, reqBody.password);
    await recordApiKeyUsage(
      apiKey,
      type,
      reqBody,
      result,
      !!(result.ok && result.sessionCookie),
      result.ok && result.sessionCookie ? 200 : 401
    );

    if (result.ok && result.sessionCookie) {
      // Set session cookie in response
      const response = NextResponse.json({
        ok: true,
        message: result.message || "Login successful",
      });
      response.headers.set(
        "Set-Cookie",
        `session=${result.sessionCookie}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 5}`
      );
      return response;
    } else {
      return NextResponse.json({
        ok: false,
        error: result.message || "Login failed.",
        message: result.message || "Login failed.",
      }, { status: 401 });
    }
  } catch (err: any) {
    try {
      await recordApiKeyUsage(
        apiKey,
        type,
        reqBody,
        { ok: false, error: err?.message || "Internal server error." },
        false,
        500
      );
    } catch {}
    return NextResponse.json({
      ok: false,
      error: err?.message || "Internal server error.",
      message: err?.message || "Internal server error.",
    }, { status: 500 });
  }
}