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
      return NextResponse.json({ ok: false, error: "Email and password are required." }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "API Key is required." }, { status: 400 });
    }
    const apiKeyRes = await verifyApiKey(apiKey);

    // If API key is invalid, just return error, do not record usage
    if (!apiKeyRes.ok) {
      return NextResponse.json({ ok: false, error: apiKeyRes.message || "Invalid API Key." }, { status: 401 });
    }

    // API key is valid, proceed with login and record usage
    const result = await loginUser(reqBody.email, reqBody.password);
    await recordApiKeyUsage(
      apiKey,
      type,
      reqBody,
      result,
      !!(result.ok && result.idToken),
      result.ok && result.idToken ? 200 : 401
    );

    if (result.ok && result.idToken) {
      return NextResponse.json({
        ok: true,
        idToken: result.idToken,
        message: result.message || "Login successful",
      });
    } else {
      // Return the message from userlogin function
      return NextResponse.json({
        ok: false,
        error: result.error || result.message || "Login failed.",
        message: result.message || result.error || "Login failed.",
      }, { status: 401 });
    }
  } catch (err: any) {
    // Always record failed usage for any error, including parsing errors
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