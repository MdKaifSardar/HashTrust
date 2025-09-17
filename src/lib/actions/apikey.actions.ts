"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getOrInitAdminApp } from "@/lib/database/AdminApp";

function generateApiKey(length = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < length; ++i) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export async function createApiKeyForOrg({
  idToken,
  organisationUid,
}: {
  idToken: string;
  organisationUid?: string;
}): Promise<{ ok: boolean; apiKey?: string; message?: string }> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    getOrInitAdminApp();
    const adminAuth = getAuth();
    const adminDb = getFirestore();

    // Verify the ID token and get the user's UID
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = organisationUid || decodedToken.uid;

    // Generate API key
    const apiKey = generateApiKey();

    // Find organisation document by UID
    const orgSnap = await adminDb
      .collection("organisations")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (orgSnap.empty) {
      return { ok: false, message: "Organisation not found." };
    }

    const orgDocRef = orgSnap.docs[0].ref;

    // Save API key to organisation document
    await orgDocRef.update({ apiKey });

    return { ok: true, apiKey, message: "API Key created and saved successfully." };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Failed to create API Key.",
    };
  }
}
