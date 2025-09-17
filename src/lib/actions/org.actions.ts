"use server";

import * as admin from "firebase-admin";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseApp } from "../database/firebase";

let adminInitialized = false;
function getOrInitAdminApp() {
  if (typeof window !== "undefined") return; // Never run admin SDK on client
  if (!adminInitialized && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    adminInitialized = true;
  }
  return admin;
}

export async function createOrganisation({
  orgName,
  email,
  password,
  contactPerson,
}: {
  orgName: string;
  email: string;
  password: string;
  contactPerson: string;
}): Promise<{ ok: boolean; message: string; idToken?: string }> {
  try {
    if (!orgName || !email || !password || !contactPerson) {
      return { ok: false, message: "All fields are required." };
    }
    const auth = getAuth(firebaseApp);
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use") {
        return {
          ok: false,
          message:
            "This email is already registered. Please use another email or log in.",
        };
      }
      return {
        ok: false,
        message: err?.message || "Failed to create organisation account.",
      };
    }
    const firebaseUser = userCredential.user;
    let idToken: string | undefined;
    try {
      await updateProfile(firebaseUser, { displayName: orgName });
      idToken = await firebaseUser.getIdToken();
    } catch (err: any) {
      return {
        ok: false,
        message: "Failed to update organisation profile or get token.",
      };
    }
    const db = getFirestore(firebaseApp);
    const orgDoc = {
      uid: firebaseUser.uid,
      orgName,
      email,
      contactPerson,
      createdAt: new Date().toISOString(),
    };
    try {
      await addDoc(collection(db, "organisations"), orgDoc);
    } catch (err: any) {
      return {
        ok: false,
        message: "Failed to save organisation data. Please try again.",
      };
    }
    return {
      ok: true,
      message: "Organisation account created successfully!",
      idToken,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Server error. Please try again later.",
    };
  }
}

export async function loginOrganisation({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ ok: boolean; message: string; idToken?: string }> {
  try {
    if (!email || !password) {
      return { ok: false, message: "Email and password are required." };
    }
    const auth = getAuth(firebaseApp);
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      if (
        err?.code === "auth/user-not-found" ||
        err?.code === "auth/wrong-password"
      ) {
        return { ok: false, message: "Invalid email or password." };
      }
      return { ok: false, message: err?.message || "Failed to login." };
    }
    const firebaseUser = userCredential.user;
    let idToken: string | undefined;
    try {
      idToken = await firebaseUser.getIdToken();
    } catch (err: any) {
      return { ok: false, message: "Failed to get authentication token." };
    }
    const db = getFirestore(firebaseApp);
    const q = query(
      collection(db, "organisations"),
      where("email", "==", email)
    );
    const orgSnap = await getDocs(q);
    if (orgSnap.empty) {
      return { ok: false, message: "Organisation not found in database." };
    }
    return { ok: true, message: "Organisation login successful!", idToken };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Server error. Please try again later.",
    };
  }
}

export async function authenticateOrgWithIdToken(
  idToken: string
): Promise<{ ok: boolean; organisation?: any; message?: string }> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    getOrInitAdminApp();
    const adminAuth = admin.auth();
    const adminDb = admin.firestore();
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    // Fetch organisation data from Firestore
    const orgDocSnap = await adminDb
      .collection("organisations")
      .where("uid", "==", uid)
      .limit(1)
      .get();
    if (orgDocSnap.empty) {
      return { ok: false, message: "Organisation not found in database." };
    }
    const organisation = orgDocSnap.docs[0].data();
    return {
      ok: true,
      organisation,
      message: "Organisation authenticated successfully.",
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Authentication failed.";
    if (err?.code === "auth/argument-error") {
      errorMsg = "Invalid or expired token.";
    }
    return { ok: false, message: errorMsg };
  }
}


export async function fetchOrgDetailsWithIdToken(
  idToken: string
): Promise<{ ok: boolean; organisation?: any; message?: string }> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    getOrInitAdminApp();
    const adminAuth = admin.auth();
    const adminDb = admin.firestore();
    // Verify the ID token and get the user's UID
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    // Fetch only the organisation document for this UID
    const orgDocSnap = await adminDb
      .collection("organisations")
      .where("uid", "==", uid)
      .limit(1)
      .get();
    if (orgDocSnap.empty) {
      return {
        ok: false,
        message: "Organisation not found in database.",
        organisation: null,
      };
    }
    const organisation = orgDocSnap.docs[0].data();
    return {
      ok: true,
      organisation,
      message: "Fetched organisation successfully.",
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Failed to fetch organisation.";
    if (err?.code === "auth/argument-error") {
      errorMsg = "Invalid or expired token.";
    }
    return { ok: false, message: errorMsg, organisation: null };
  }
}
