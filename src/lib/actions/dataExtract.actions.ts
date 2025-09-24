import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerateContentResult,
} from "@google/generative-ai";

// Helper to convert the file to base64
async function fileToBase64(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

interface ExtractedData {
  name: string | null;
  dob: string | null;
  phone: string | null;
  address: {
    po: string | null;
    district: string | null;
    state: string | null;
    pin: string | null;
  };
  idNumber?: string | null; // Aadhaar number
}

export async function extractUserDataWithGemini(
  file: File
): Promise<ExtractedData> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Google Gemini API key is missing");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model: GenerativeModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const imageBase64: string = await fileToBase64(file);

  const prompt: string = `
    The provided document is an Aadhaar card (Indian national identity card).
    Extract the following fields from the image:
    - Name
    - Date of Birth
    - Phone Number
    - Aadhaar Number (12-digit ID number, sometimes called UID, usually printed in large font)
    - Address (with the following subfields: PO (Post Office), District, State, Pin Code)

    Respond in JSON format:
    {
      "name": "...",
      "dob": "...",
      "phone": "...",
      "idNumber": "...",
      "address": {
        "po": "...",
        "district": "...",
        "state": "...",
        "pin": "..."
      }
    }
    If any field is missing, set its value to null.
    Respond with only the JSON, no markdown or code block formatting.
  `;

  let result: GenerateContentResult;
  try {
    result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.type,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });
  } catch (err) {
    throw new Error("Could not extract data from the document. Please try again later.");
  }

  const textPromise = result.response.text();
  let extracted: ExtractedData = {
    name: null,
    dob: null,
    phone: null,
    idNumber: null,
    address: {
      po: null,
      district: null,
      state: null,
      pin: null,
    },
  };

  try {
    const text = await textPromise;
    // Remove markdown/code block formatting if present
    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();
    const parsed: ExtractedData = JSON.parse(cleanedText);
    extracted = {
      name: parsed.name ?? null,
      dob: parsed.dob ?? null,
      phone: parsed.phone ?? null,
      idNumber: parsed.idNumber ?? null,
      address: {
        po: parsed.address?.po ?? null,
        district: parsed.address?.district ?? null,
        state: parsed.address?.state ?? null,
        pin: parsed.address?.pin ?? null,
      },
    };
  } catch (e) {
    throw new Error("Could not understand the document. Please upload a clear image of your ID.");
  }

  // Check for missing data
  if (
    !extracted.name ||
    !extracted.dob ||
    !extracted.phone ||
    !extracted.idNumber ||
    !extracted.address.po ||
    !extracted.address.district ||
    !extracted.address.state ||
    !extracted.address.pin
  ) {
    throw new Error("Some required fields could not be extracted. Please try another document or a clearer image.");
  }

  return extracted;
}
