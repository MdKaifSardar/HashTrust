"use server";

const CLARIFAI_PAT = process.env.CLARIFAI_PAT;
const USER_ID = "minivision-ai";
const APP_ID = "silent-face-anti-spoofing";
const MODEL_ID = "silent-face-anti-spoofing";
const MODEL_VERSION_ID = "727e809518234b9e8778e7ee16c74e96";

if (!CLARIFAI_PAT) {
  console.warn("Warning: CLARIFAI_PAT not set. Set it in your environment.");
}

async function callClarifai(payload: any) {
  const endpoint = `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Key ${CLARIFAI_PAT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!res.ok) {
      throw { status: res.status, json };
    }
    return json;
  } catch (e) {
    if (!res.ok) throw { status: res.status, raw: text };
    return { raw: text };
  }
}

/**
 * Takes an image File (or Blob/base64 string) and sends it directly to Clarifai
 */
export async function detectLiveness(image: File | Blob | string) {
  if (!CLARIFAI_PAT)
    throw new Error("Server misconfiguration: missing CLARIFAI_PAT");

  let base64: string;

  if (typeof image === "string") {
    base64 = image.startsWith("data:") ? image.split(",")[1] : image;
  } else {
    // Blob/File to ArrayBuffer
    const arrayBuffer = await image.arrayBuffer();
    base64 = Buffer.from(arrayBuffer).toString("base64");
  }

  const payload = {
    user_app_id: { user_id: USER_ID, app_id: APP_ID },
    inputs: [{ data: { image: { base64 } } }],
  };

  const apiResponse = await callClarifai(payload);

  const concepts = apiResponse?.outputs?.[0]?.data?.concepts ?? [];
  const realConcept = concepts.find((c: any) => c.id === "real");
  const realScoreRaw = realConcept?.value ?? 0;
  const realScore = Math.round(realScoreRaw * 10 * 10) / 10;

  const maxConcept = concepts.reduce(
    (max: any, c: any) => (c.value > max.value ? c : max),
    { value: 0 }
  );
  const isLive = maxConcept.id === "real";

  return { isLive, score: realScore };
}
