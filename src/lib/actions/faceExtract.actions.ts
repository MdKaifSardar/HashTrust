"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface DetectedFaceBox {
  top: number;
  left: number;
  width: number;
  height: number;
  isNormalized?: boolean; // true if coordinates are normalized 0-1000 (from Gemini)
}

export interface ExtractFaceActionResult {
  ok: boolean;
  box?: DetectedFaceBox;
  error?: string;
  engine?: "facepp" | "gemini";
}

/**
 * Converts a File or Blob to base64
 */
async function fileToBase64(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

/**
 * Primary Engine: Detects face bounding box using Face++ Detect API
 */
async function detectWithFacePlusPlus(file: File): Promise<ExtractFaceActionResult> {
  const API_KEY = process.env.FACEPP_API_KEY;
  const API_SECRET = process.env.FACEPP_API_SECRET;
  const BASE = process.env.FACEPP_API_BASE ?? "https://api-us.faceplusplus.com";
  const endpoint = `${BASE}/facepp/v3/detect`;

  if (!API_KEY || !API_SECRET) {
    return { ok: false, error: "Missing Face++ API credentials." };
  }

  const formData = new FormData();
  formData.append("api_key", API_KEY);
  formData.append("api_secret", API_SECRET);
  formData.append("image_file", file);
  formData.append("return_landmark", "0");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for Vercel

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data?.error_message) {
      return {
        ok: false,
        error: data?.error_message || `Face++ returned HTTP ${res.status}`,
      };
    }

    const faces = data?.faces;
    if (!Array.isArray(faces) || faces.length === 0) {
      return {
        ok: false,
        error: "NO_FACE_DETECTED",
      };
    }

    // If multiple faces detected (e.g. background/watermarks), select the largest by area
    let primaryFace = faces[0];
    let maxArea = 0;
    for (const face of faces) {
      const rect = face.face_rectangle;
      if (rect) {
        const area = (rect.width || 0) * (rect.height || 0);
        if (area > maxArea) {
          maxArea = area;
          primaryFace = face;
        }
      }
    }

    const rect = primaryFace.face_rectangle;
    if (!rect || typeof rect.top !== "number" || typeof rect.left !== "number") {
      return { ok: false, error: "Invalid face coordinates returned from Face++." };
    }

    return {
      ok: true,
      box: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        isNormalized: false,
      },
      engine: "facepp",
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      ok: false,
      error: err?.name === "AbortError" ? "Face++ request timed out." : err?.message || "Face++ detection failed.",
    };
  }
}

/**
 * Fallback Engine: Detects face bounding box using Google Gemini 2.5 Flash
 */
async function detectWithGemini(file: File): Promise<ExtractFaceActionResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Google Gemini API key is missing." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const imageBase64 = await fileToBase64(file);

    const prompt = `
      Locate the primary portrait photograph of the person on this identity document.
      Return a JSON object in this exact schema:
      {
        "found": true,
        "box_2d": [ymin, xmin, ymax, xmax]
      }
      where ymin, xmin, ymax, xmax are normalized integer coordinates from 0 to 1000 representing the bounding box of the face.
      If no human face or portrait is detected on the document, return:
      {
        "found": false,
        "reason": "No face found"
      }
      Return ONLY raw JSON with no markdown code blocks.
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.type || "image/jpeg",
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const text = result.response.text();
    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const parsed = JSON.parse(cleanedText);

    if (!parsed.found || !Array.isArray(parsed.box_2d) || parsed.box_2d.length !== 4) {
      return {
        ok: false,
        error: parsed.reason || "No face detected in the document by Gemini.",
      };
    }

    const [ymin, xmin, ymax, xmax] = parsed.box_2d;
    const top = Math.max(0, ymin);
    const left = Math.max(0, xmin);
    const height = Math.max(1, ymax - ymin);
    const width = Math.max(1, xmax - xmin);

    return {
      ok: true,
      box: {
        top,
        left,
        width,
        height,
        isNormalized: true, // 0 - 1000 range
      },
      engine: "gemini",
    };
  } catch (err: any) {
    return {
      ok: false,
      error: `Gemini face detection failed: ${err?.message || "Unknown error"}`,
    };
  }
}

/**
 * Server Action: Orchestrates Dual-Engine Face Detection for ID Documents
 */
export async function extractFaceCoordinatesAction(formData: FormData): Promise<ExtractFaceActionResult> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      ok: false,
      error: "Please upload a valid image file of your identity document.",
    };
  }

  // Validate Vercel payload constraints (4.5MB serverless limit)
  if (file.size > 4.5 * 1024 * 1024) {
    return {
      ok: false,
      error: "Image exceeds 4.5MB. Please upload an image under 4.5MB.",
    };
  }

  // 1. Try Primary Engine: Face++
  const facePlusPlusResult = await detectWithFacePlusPlus(file);

  if (facePlusPlusResult.ok) {
    return facePlusPlusResult;
  }

  // 2. If Face++ encountered an error OR reported no face, attempt Gemini Fallback
  console.warn("Face++ detection did not succeed, trying Gemini 2.5 Flash fallback:", facePlusPlusResult.error);
  const geminiResult = await detectWithGemini(file);

  if (geminiResult.ok) {
    return geminiResult;
  }

  // Both engines failed or found no face
  if (facePlusPlusResult.error === "NO_FACE_DETECTED" || geminiResult.error?.includes("No face")) {
    return {
      ok: false,
      error: "No clear face could be detected on the document. Please ensure the portrait photo is well-lit and not covered.",
    };
  }

  return {
    ok: false,
    error: geminiResult.error || facePlusPlusResult.error || "Unable to detect a face on this document. Please try a clearer image.",
  };
}
