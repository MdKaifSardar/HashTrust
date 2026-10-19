// Export admin initialization for server-side SDK usage

import * as admin from "firebase-admin";

let adminInitialized = false;

function formatPrivateKey(key?: string) {
  if (!key) return undefined;
  return key.replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");
}

export function getOrInitAdminApp() {
  if (typeof window !== "undefined") return; // Never run admin SDK on client
  if (!adminInitialized && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
      }),
    });
    adminInitialized = true;
  }
  return admin;
}
