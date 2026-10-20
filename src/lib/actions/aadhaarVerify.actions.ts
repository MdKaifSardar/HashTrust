"use server";

import { extractAndVerifyAadhaarQR } from "../aadhaar/qrDecoder";
import { crossMatchAadhaarData } from "../aadhaar/crossMatcher";
import { AadhaarCrossMatchResult, AadhaarSecureQRData } from "../aadhaar/types";

export interface VerifyDocumentActionResult {
  success: boolean;
  qrDetected: boolean;
  qrData?: AadhaarSecureQRData;
  crossMatch?: AadhaarCrossMatchResult;
  governmentPhoto?: string; // Base64 image directly from QR code
  error?: string;
}

/**
 * Server action to parse Aadhaar Secure QR code and perform cryptographic cross-checking.
 */
export async function verifyAadhaarDocumentAction(
  formData: FormData,
  visualData?: {
    name?: string;
    dob?: string;
    idNumber?: string;
  }
): Promise<VerifyDocumentActionResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, qrDetected: false, error: "No document provided" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extract and verify Secure QR from document buffer
    const qrData = await extractAndVerifyAadhaarQR(buffer);

    if (!qrData) {
      return {
        success: true,
        qrDetected: false,
        error: "No readable QR code found on the document.",
      };
    }

    // 2. Perform 3-way cross-check if visual OCR data was passed
    let crossMatch: AadhaarCrossMatchResult | undefined = undefined;
    if (visualData && (visualData.name || visualData.dob)) {
      crossMatch = crossMatchAadhaarData(visualData, qrData);
    }

    return {
      success: true,
      qrDetected: true,
      qrData,
      crossMatch,
      governmentPhoto: qrData.photoBase64,
    };
  } catch (err: any) {
    console.error("Aadhaar verification server action error:", err?.message || err);
    return {
      success: false,
      qrDetected: false,
      error: err?.message || "Internal document verification failure.",
    };
  }
}
