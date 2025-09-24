"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getOrInitAdminApp } from "@/lib/database/AdminApp";
import { FieldValue } from "firebase-admin/firestore";

function generateApiKey(length = 32) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < length; ++i) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export async function createApiKeyForOrg({
  sessionCookie,
  organisationUid,
}: {
  sessionCookie: string;
  organisationUid?: string;
}): Promise<{ ok: boolean; apiKey?: string; message?: string }> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    getOrInitAdminApp();
    const adminAuth = getAuth();
    const adminDb = getFirestore();

    // Verify the session cookie and get the user's UID
    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    const uid = organisationUid || decodedToken.uid;

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
    const orgData = orgSnap.docs[0].data();

    // Check if org already has an API key
    const apiKeysArr = Array.isArray(orgData.apiKeys) ? orgData.apiKeys : [];
    if (apiKeysArr.length > 0) {
      return {
        ok: false,
        message:
          "Organisation already has an API Key. Only one API Key is allowed.",
      };
    }

    // Generate API key
    const apiKey = generateApiKey();

    // Create API key document in apikeys collection
    await adminDb.collection("apikeys").add({
      apiKey,
      organisationUid: uid,
      createdAt: new Date(),
    });

    // Save API key to organisation document as array
    apiKeysArr.push({
      apiKey,
      createdAt: new Date(),
    });

    await orgDocRef.update({ apiKeys: apiKeysArr });

    return {
      ok: true,
      apiKey,
      message: "API Key created and saved successfully.",
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Failed to create API Key.",
    };
  }
}

export async function deleteApiKeyById(
  apiKeyId: string,
  sessionCookie: string
): Promise<{ ok: boolean; message?: string }> {
  try {
    if (typeof window !== "undefined") {
      return {
        ok: false,
        message: "This function must be called from the server.",
      };
    }
    getOrInitAdminApp();
    const adminDb = getFirestore();
    const adminAuth = getAuth();

    // Find the API key document
    const apiKeyDocRef = adminDb.collection("apikeys").doc(apiKeyId);
    const apiKeyDocSnap = await apiKeyDocRef.get();
    if (!apiKeyDocSnap.exists) {
      return { ok: false, message: "API Key not found." };
    }
    const apiKeyData = apiKeyDocSnap.data();
    if (!apiKeyData) {
      return { ok: false, message: "API Key data is undefined." };
    }
    const apiKeyValue = apiKeyData.apiKey;
    const organisationUid = apiKeyData.organisationUid;

    // Delete the API key document
    try {
      await apiKeyDocRef.delete();
    } catch (err: any) {
      return { ok: false, message: "Failed to delete API Key document." };
    }

    // Find the organisation document by UID (from token or apiKey doc)
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (err: any) {
      return { ok: false, message: "Invalid or expired authentication token." };
    }
    const uid = organisationUid || decodedToken.uid;
    const orgSnap = await adminDb
      .collection("organisations")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (orgSnap.empty) {
      return { ok: false, message: "Organisation not found." };
    }

    const orgDocRef = orgSnap.docs[0].ref;
    const orgData = orgSnap.docs[0].data();

    // Remove only the deleted API key from the organisation's apiKeys array
    let apiKeysArr = Array.isArray(orgData.apiKeys) ? orgData.apiKeys : [];
    const beforeCount = apiKeysArr.length;
    apiKeysArr = apiKeysArr.filter((key: any) => key.apiKey !== apiKeyValue);
    const afterCount = apiKeysArr.length;

    if (beforeCount === afterCount) {
      return {
        ok: false,
        message: "API Key not found in organisation's API keys array.",
      };
    }

    try {
      await orgDocRef.update({ apiKeys: apiKeysArr });
    } catch (err: any) {
      return {
        ok: false,
        message: "Failed to update organisation API keys array.",
      };
    }

    return { ok: true, message: "API Key deleted successfully." };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Failed to delete API Key.",
    };
  }
}

export async function getApiKeysForOrg({
  sessionCookie,
  organisationUid,
}: {
  sessionCookie: string;
  organisationUid?: string;
}): Promise<{
  ok: boolean;
  apiKeys?: Array<{ id: string; apiKey: string; createdAt: string }>;
  message?: string;
}> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    getOrInitAdminApp();
    const adminAuth = getAuth();
    const adminDb = getFirestore();

    // Verify session cookie and get UID
    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    const uid = organisationUid || decodedToken.uid;

    // Fetch API keys for this organisation from the apikeys collection
    const snap = await adminDb
      .collection("apikeys")
      .where("organisationUid", "==", uid)
      .get();

    const apiKeysArr = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        apiKey: data.apiKey,
        createdAt:
          data.createdAt && data.createdAt.toDate
            ? data.createdAt.toDate().toISOString()
            : typeof data.createdAt === "string"
            ? data.createdAt
            : "",
      };
    });

    return { ok: true, apiKeys: apiKeysArr };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Failed to fetch API Keys.",
    };
  }
}

export async function verifyApiKey(
  apiKey: string
): Promise<{ ok: boolean; organisationUid?: string; message?: string }> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    getOrInitAdminApp();
    const adminDb = getFirestore();

    // Search for the apiKey in the apikeys collection
    const snap = await adminDb
      .collection("apikeys")
      .where("apiKey", "==", apiKey)
      .limit(1)
      .get();

    if (snap.empty) {
      return { ok: false, message: "API Key not found or invalid." };
    }

    const doc = snap.docs[0].data();
    return {
      ok: true,
      organisationUid: doc.organisationUid,
      message: "API Key is valid.",
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Failed to verify API Key.",
    };
  }
}

export async function recordApiKeyUsage(
  apiKey: string,
  type: string,
  request?: any,
  response?: any,
  success?: boolean,
  status?: number
): Promise<{ ok: boolean; message?: string }> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    getOrInitAdminApp();
    const adminDb = getFirestore();

    // Find the API key document
    const snap = await adminDb
      .collection("apikeys")
      .where("apiKey", "==", apiKey)
      .limit(1)
      .get();

    if (snap.empty) {
      return { ok: false, message: "API Key not found." };
    }

    const docRef = snap.docs[0].ref;
    // Add usage record: { time, type, request, response, success, status }
    await docRef.set(
      {
        usageLog: FieldValue.arrayUnion({
          time: new Date().toISOString(),
          type: type,
          request: request ? JSON.stringify(request) : "",
          response: response ? JSON.stringify(response) : "",
          success:
            typeof success === "boolean"
              ? success
              : !!(response && response.ok),
          status:
            typeof status === "number"
              ? status
              : response && typeof response.status === "number"
              ? response.status
              : response && response.ok
              ? 200
              : 400,
        }),
      },
      { merge: true }
    );

    return { ok: true, message: "Usage recorded." };
  } catch (err: any) {
    return { ok: false, message: err?.message || "Failed to record usage." };
  }
}

export async function getApiKeyUsageData(apiKey: string): Promise<{
  ok: boolean;
  usageLog?: Array<{ time: string; type: string }>;
  message?: string;
}> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    getOrInitAdminApp();
    const adminDb = getFirestore();

    // Find the API key document
    const snap = await adminDb
      .collection("apikeys")
      .where("apiKey", "==", apiKey)
      .limit(1)
      .get();

    if (snap.empty) {
      return { ok: false, message: "API Key not found." };
    }

    const data = snap.docs[0].data();
    return {
      ok: true,
      usageLog: Array.isArray(data.usageLog) ? data.usageLog : [],
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Failed to fetch usage data.",
    };
  }
}
