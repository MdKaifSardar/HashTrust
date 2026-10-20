import { AadhaarCrossMatchResult, AadhaarSecureQRData } from "./types";

/**
 * Normalizes strings for robust fuzzy comparison (lowercased, trimmed, extra spaces & punctuation removed)
 */
function normalizeText(text?: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if two names match using word tokens (handles "First Last" vs "Last First" and initials)
 */
function compareNames(nameA?: string, nameB?: string): boolean {
  const normA = normalizeText(nameA);
  const normB = normalizeText(nameB);

  if (!normA || !normB) return false;
  if (normA === normB) return true;

  const tokensA = new Set(normA.split(" ").filter((t) => t.length > 1));
  const tokensB = new Set(normB.split(" ").filter((t) => t.length > 1));

  let matchingTokens = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) matchingTokens++;
  }

  const minTokens = Math.min(tokensA.size, tokensB.size);
  if (minTokens === 0) return false;

  // At least 60% token overlap
  return matchingTokens / minTokens >= 0.6;
}

/**
 * Normalizes and compares dates of birth
 */
function compareDOB(dobA?: string, dobB?: string): boolean {
  if (!dobA || !dobB) return false;

  // Extract all 4-digit years and 2-digit components
  const cleanA = dobA.replace(/[^0-9]/g, "");
  const cleanB = dobB.replace(/[^0-9]/g, "");

  if (cleanA === cleanB) return true;

  // Check if birth year matches
  const yearA = dobA.match(/\b(19\d{2}|20\d{2})\b/)?.[0];
  const yearB = dobB.match(/\b(19\d{2}|20\d{2})\b/)?.[0];

  if (yearA && yearB && yearA === yearB) {
    return true;
  }

  return false;
}

/**
 * 3-Way Cross-Matcher:
 * Compares visually extracted OCR fields against cryptographically signed QR data.
 */
export function crossMatchAadhaarData(
  visualData: {
    name?: string;
    dob?: string;
    idNumber?: string;
  },
  qrData?: AadhaarSecureQRData | null
): AadhaarCrossMatchResult {
  const discrepancies: string[] = [];

  if (!qrData) {
    return {
      isAuthentic: false,
      isTampered: false, // Inconclusive without QR
      nameMatch: false,
      dobMatch: false,
      photoVerified: false,
      visualData,
      discrepancies: ["No readable UIDAI Secure QR code detected on the document."],
    };
  }

  // 1. Name Check
  const nameMatch = compareNames(visualData.name, qrData.name);
  if (!nameMatch && visualData.name && qrData.name) {
    discrepancies.push(
      `Visual Name ("${visualData.name}") does not match Government QR Name ("${qrData.name}"). Potential Photoshop forgery detected.`
    );
  }

  // 2. DOB Check
  const dobMatch = compareDOB(visualData.dob, qrData.dob);
  if (!dobMatch && visualData.dob && qrData.dob) {
    discrepancies.push(
      `Visual Date of Birth ("${visualData.dob}") does not match Government QR Date of Birth ("${qrData.dob}").`
    );
  }

  // 3. Cryptographic Signature Status
  if (qrData.rawSignatureHex && !qrData.isSignatureVerified) {
    discrepancies.push(
      qrData.signatureError || "UIDAI RSA-2048 digital signature is invalid or tampered."
    );
  }

  const isTampered = discrepancies.length > 0;
  const isAuthentic = qrData.isSignatureVerified && nameMatch && dobMatch;
  const photoVerified = !!qrData.photoBase64;

  return {
    isAuthentic,
    isTampered,
    nameMatch,
    dobMatch,
    photoVerified,
    visualData,
    qrData,
    discrepancies,
  };
}
