import { Jimp } from "jimp";
import {
  BinaryBitmap,
  HybridBinarizer,
  MultiFormatReader,
  RGBLuminanceSource,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { parseAadhaarSecureQR } from "./secureQrParser";
import { AadhaarSecureQRData } from "./types";

export interface DecodedQRRawResult {
  text: string;
  rawBytes?: Uint8Array;
}

/**
 * Scans an image (Buffer, base64 data URL, or File) and extracts QR code data.
 */
export async function decodeQRCodeFromImage(
  imageInput: Buffer | string
): Promise<DecodedQRRawResult | null> {
  try {
    let buffer: Buffer;

    if (typeof imageInput === "string") {
      if (imageInput.startsWith("data:")) {
        const base64Data = imageInput.split(",")[1];
        buffer = Buffer.from(base64Data, "base64");
      } else {
        buffer = Buffer.from(imageInput, "base64");
      }
    } else {
      buffer = imageInput;
    }

    const image = await Jimp.read(buffer);

    const tryDecode = (bitmapData: Buffer, w: number, h: number): DecodedQRRawResult | null => {
      try {
        const luminanceSource = new RGBLuminanceSource(
          new Uint8ClampedArray(bitmapData),
          w,
          h
        );
        const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

        const hints = new Map<DecodeHintType, any>();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
        hints.set(DecodeHintType.TRY_HARDER, true);

        const reader = new MultiFormatReader();
        reader.setHints(hints);

        const result = reader.decode(binaryBitmap);
        if (result) {
          return {
            text: result.getText(),
            rawBytes: result.getRawBytes(),
          };
        }
      } catch {
        // Continue to fallback passes
      }
      return null;
    };

    // Pass 1: Original image
    let decoded = tryDecode(image.bitmap.data, image.bitmap.width, image.bitmap.height);
    if (decoded) return decoded;

    // Pass 2: High contrast pass for smartphone document scans
    try {
      const cloned = image.clone();
      cloned.greyscale();
      cloned.contrast(0.2);
      decoded = tryDecode(cloned.bitmap.data, cloned.bitmap.width, cloned.bitmap.height);
      if (decoded) return decoded;
    } catch {
      // Ignore fallback error
    }

    return null;
  } catch (err: any) {
    console.warn("QR scanner pass completed without detection:", err?.message || err);
    return null;
  }
}

/**
 * End-to-end scanner and parser for Aadhaar documents
 */
export async function extractAndVerifyAadhaarQR(
  imageInput: Buffer | string
): Promise<AadhaarSecureQRData | null> {
  const qrRaw = await decodeQRCodeFromImage(imageInput);
  if (!qrRaw) return null;

  // Use raw bytes if available; fallback to text payload
  const inputPayload = qrRaw.rawBytes && qrRaw.rawBytes.length > 0 ? qrRaw.rawBytes : qrRaw.text;
  return parseAadhaarSecureQR(inputPayload);
}
