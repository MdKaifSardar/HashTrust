// app/actions/facepp-compare.ts
"use server";

export async function compareFacesAction(formData: FormData) {
  try {
    const API_KEY = process.env.FACEPP_API_KEY;
    const API_SECRET = process.env.FACEPP_API_SECRET;
    const BASE =
      process.env.FACEPP_API_BASE ?? "https://api-us.faceplusplus.com";
    const endpoint = `${BASE}/facepp/v3/compare`;

    if (!API_KEY || !API_SECRET) {
      return { ok: false, message: "Missing Face++ API credentials." };
    }

    const file1 = formData.get("image1");
    const file2 = formData.get("image2");

    if (!(file1 instanceof File) || !(file2 instanceof File)) {
      return { ok: false, message: "Please provide two valid image files." };
    }

    const apiForm = new FormData();
    apiForm.append("api_key", API_KEY);
    apiForm.append("api_secret", API_SECRET);
    apiForm.append("image_file1", file1);
    apiForm.append("image_file2", file2);

    const res = await fetch(endpoint, { method: "POST", body: apiForm });

    let data: any = {};
    try {
      data = await res.json();
    } catch (e) {
      return { ok: false, message: "Invalid response from Face++ API." };
    }

    if (!res.ok || data?.error_message) {
      return {
        ok: false,
        message: data?.error_message || "Face++ request failed.",
      };
    }

    if (typeof data.confidence !== "number") {
      return {
        ok: false,
        message: "No similarity score returned from Face++.",
      };
    }

    // ✅ threshold check (only here)
    const threshold = 70;
    const isMatch = data.confidence >= threshold;

    return {
      ok: true,
      confidence: data.confidence,
      isMatch,
      message: isMatch
        ? `Faces match`
        : `Faces do not match`,
    };
  } catch (err: any) {
    return { ok: false, message: `Error: ${err?.message || "Unknown error"}` };
  }
}
