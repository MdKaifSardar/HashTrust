import zlib from "zlib";
import crypto from "crypto";
import { AadhaarSecureQRData } from "./types";
import { UIDAI_PUBLIC_KEY_PEM } from "./uidaiCertificate";

/**
 * Parses raw Aadhaar QR code data (either a numeric BigInt string or a raw byte buffer)
 * according to the UIDAI Secure QR Code specification.
 */
export function parseAadhaarSecureQR(
  rawInput: string | Buffer | Uint8Array
): AadhaarSecureQRData | null {
  try {
    let byteBuffer: Buffer;

    if (typeof rawInput === "string") {
      const trimmed = rawInput.trim();
      // If the QR contains plain XML (legacy cards from pre-2018)
      if (trimmed.startsWith("<?xml") || trimmed.includes("<PrintLetterBarcodeData")) {
        return parseLegacyXmlQR(trimmed);
      }

      // Modern Secure QR: big integer decimal string
      if (/^\d+$/.test(trimmed)) {
        let hex = BigInt(trimmed).toString(16);
        if (hex.length % 2 !== 0) hex = "0" + hex;
        byteBuffer = Buffer.from(hex, "hex");
      } else {
        // May be base64 or raw string
        byteBuffer = Buffer.from(trimmed, "base64");
      }
    } else {
      byteBuffer = Buffer.from(rawInput);
    }

    if (!byteBuffer || byteBuffer.length < 260) {
      return null;
    }

    // UIDAI Secure QR v2/v3 structure:
    // First 256 bytes = RSA-2048 digital signature
    // Remaining bytes = DEFLATE compressed binary demographic & biometric payload
    const signatureBytes = byteBuffer.subarray(0, 256);
    const compressedData = byteBuffer.subarray(256);

    // Verify RSA-2048 signature with UIDAI Public Key
    let isSignatureVerified = false;
    let signatureError: string | undefined = undefined;

    try {
      if (UIDAI_PUBLIC_KEY_PEM) {
        const verifier = crypto.createVerify("RSA-SHA256");
        verifier.update(compressedData);
        isSignatureVerified = verifier.verify(UIDAI_PUBLIC_KEY_PEM, signatureBytes);
      }
    } catch (sigErr: any) {
      signatureError = sigErr?.message || "Signature check failed";
      isSignatureVerified = false;
    }

    // Decompress payload using zlib (DEFLATE raw or standard)
    let decompressed: Buffer;
    try {
      decompressed = zlib.inflateRawSync(compressedData);
    } catch {
      try {
        decompressed = zlib.inflateSync(compressedData);
      } catch {
        decompressed = zlib.gunzipSync(compressedData);
      }
    }

    if (!decompressed || decompressed.length === 0) {
      return null;
    }

    // Demographic text fields are separated by 255 (0xFF) delimiter
    const DELIMITER = 255;
    const parts: Buffer[] = [];
    let start = 0;

    for (let i = 0; i < decompressed.length; i++) {
      if (decompressed[i] === DELIMITER) {
        parts.push(decompressed.subarray(start, i));
        start = i + 1;
        // In UIDAI specification, the 15th/16th field is the photo byte stream
        if (parts.length >= 15) {
          // The remainder of the buffer is the photo bytes
          parts.push(decompressed.subarray(start));
          break;
        }
      }
    }

    const toStringSafe = (buf?: Buffer) => (buf ? buf.toString("utf-8").trim() : "");

    // UIDAI standard field indices:
    // 0: Reference ID (4 digits year + timestamp/masked aadhaar)
    // 1: Name
    // 2: Date of Birth (DD-MM-YYYY)
    // 3: Gender (M/F/T)
    // 4: Care of (S/O, D/O, W/O)
    // 5: District
    // 6: Landmark
    // 7: House
    // 8: Location
    // 9: Pin Code
    // 10: Post Office
    // 11: State
    // 12: Street
    // 13: Sub-district
    // 14: VTC (Village / Town / City)
    // 15: Photo bytes (JPEG / JPEG2000)

    const referenceId = toStringSafe(parts[0]);
    const name = toStringSafe(parts[1]);
    const dob = toStringSafe(parts[2]);
    const gender = toStringSafe(parts[3]);
    const careOf = toStringSafe(parts[4]);
    const district = toStringSafe(parts[5]);
    const landmark = toStringSafe(parts[6]);
    const house = toStringSafe(parts[7]);
    const location = toStringSafe(parts[8]);
    const pinCode = toStringSafe(parts[9]);
    const postOffice = toStringSafe(parts[10]);
    const state = toStringSafe(parts[11]);
    const street = toStringSafe(parts[12]);
    const subDistrict = toStringSafe(parts[13]);
    const vtc = toStringSafe(parts[14]);

    // Extract photo bytes
    let photoBase64: string | undefined = undefined;
    const photoBuffer = parts[15];

    if (photoBuffer && photoBuffer.length > 50) {
      // Check for JPEG magic bytes (FF D8 FF) or JPEG2000
      if (
        photoBuffer[0] === 0xff &&
        photoBuffer[1] === 0xd8 &&
        photoBuffer[2] === 0xff
      ) {
        photoBase64 = `data:image/jpeg;base64,${photoBuffer.toString("base64")}`;
      } else {
        // JPEG2000 or raw format
        photoBase64 = `data:image/jp2;base64,${photoBuffer.toString("base64")}`;
      }
    }

    return {
      referenceId,
      name,
      dob,
      gender,
      careOf,
      district,
      landmark,
      house,
      location,
      postOffice,
      state,
      street,
      subDistrict,
      vtc,
      pinCode,
      photoBase64,
      rawSignatureHex: signatureBytes.toString("hex"),
      isSignatureVerified,
      signatureError,
    };
  } catch (err: any) {
    console.error("Failed to parse Aadhaar secure QR:", err?.message || err);
    return null;
  }
}

/**
 * Fallback parser for legacy (pre-2018) unencrypted XML Aadhaar QR codes
 */
function parseLegacyXmlQR(xmlString: string): AadhaarSecureQRData | null {
  try {
    const getAttr = (attr: string): string => {
      const match = xmlString.match(new RegExp(`${attr}="([^"]*)"`, "i"));
      return match ? match[1].trim() : "";
    };

    const uid = getAttr("uid");
    const name = getAttr("name");
    const dob = getAttr("dob");
    const gender = getAttr("gender");
    const careOf = getAttr("co");
    const house = getAttr("house");
    const street = getAttr("street");
    const loc = getAttr("loc");
    const vtc = getAttr("vtc");
    const po = getAttr("po");
    const dist = getAttr("dist");
    const state = getAttr("state");
    const pc = getAttr("pc");

    if (!name && !dob && !uid) return null;

    return {
      referenceId: uid,
      name,
      dob,
      gender,
      careOf,
      house,
      street,
      location: loc,
      vtc,
      postOffice: po,
      district: dist,
      state,
      pinCode: pc,
      isSignatureVerified: false, // Legacy XML QR does not include UIDAI RSA-2048 signature
      signatureError: "Legacy XML QR format detected (unsigned).",
    };
  } catch {
    return null;
  }
}
