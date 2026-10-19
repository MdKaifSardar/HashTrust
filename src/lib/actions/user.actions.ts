"use server";

import * as admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { getContract } from "@/utils/contract";
import { generateUserDataHash } from "@/utils/generateDataHash";
import { uploadHash } from "@/utils/uploadHash";

import { getOrInitAdminApp } from "@/lib/database/AdminApp";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID!,
};
const firebaseApp = initializeApp(firebaseConfig);

export interface UserImageCloudinary {
  url: string;
  public_id: string;
}
export interface User {
  uid: string;
  name: string;
  emailAddress: string;
  userImage: UserImageCloudinary | null;
  phoneNumber?: string;
  userAddress?: string;
  dateOfBirth?: string;
  identityDocument?: UserImageCloudinary | null;
}
export interface CreateUserResult {
  user: User | null;
  idToken: string | null;
  error: string | null;
}

// Modified Cloudinary upload to extract public_id
async function uploadAndExtract(file: File, uploadPreset: string) {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to upload file to Cloudinary");
  }

  const data = await res.json();
  return {
    url: data.secure_url as string,
    public_id: data.public_id as string,
  };
}

export async function createUser(
  name: string,
  emailAddress: string,
  password: string,
  userImageFile?: File | string,
  phoneNumber?: string,
  userAddress?: string,
  dateOfBirth?: string,
  identityDocumentFile?: File | string,
  verificationStatus?: {
    faceLiveness?: { status: string; score: number | null };
    faceSimilarity?: { status: string; score: number | null };
  },
  role = "user",
  idNumber?: string // Aadhaar number
): Promise<{ ok: boolean; message?: string; sessionCookie?: string }> {
  try {
    getOrInitAdminApp(); // <-- Ensure Admin SDK is initialized at the start
    // ✅ Convert base64 to File
    const base64ToFile = (base64: string, filename: string): File => {
      const arr = base64.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
      const bstr = atob(arr[1]);
      const u8arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
      return new File([u8arr], filename, { type: mime });
    };
    const auth = getAuth(firebaseApp);

    // ✅ Step 1: Create Firebase Auth user
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        emailAddress,
        password
      );
    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use") {
        // Efficient Firestore query for user document with same email and role
        const firestoreDb = getFirestore(firebaseApp);

        // Check for duplicate Aadhaar number before creating user
        if (idNumber) {
          const aadhaarQuery = query(
            collection(firestoreDb, "users"),
            where("idNumber", "==", idNumber)
          );
          const aadhaarSnap = await getDocs(aadhaarQuery);
          if (!aadhaarSnap.empty) {
            return {
              ok: false,
              message: "A user with this Aadhaar number already exists.",
            };
          }
        }

        const userQuery = query(
          collection(firestoreDb, "users"),
          where("emailAddress", "==", emailAddress),
          where("role", "==", role)
        );
        const userSnap = await getDocs(userQuery);
        if (!userSnap.empty) {
          return {
            ok: false,
            message:
              "This email is already registered as a user. Please use another email or log in.",
          };
        }
        // If no user doc exists, sign in to get Firebase UID and proceed
        let firebaseUser: FirebaseUser;
        try {
          const signInRes = await signInWithEmailAndPassword(
            auth,
            emailAddress,
            password
          );
          firebaseUser = signInRes.user;
        } catch (signInErr: any) {
          return {
            ok: false,
            message:
              "Email exists but password is incorrect. Please log in or use a different email.",
          };
        }

        // Step 2: Prepare files for Cloudinary
        const userImageFileObj =
          typeof userImageFile === "string" && userImageFile.startsWith("data:")
            ? base64ToFile(userImageFile, "user-image.jpg")
            : userImageFile instanceof File
            ? userImageFile
            : undefined;

        let identityDocumentFileObj: File | undefined = undefined;
        if (identityDocumentFile) {
          if (typeof identityDocumentFile === "string") {
            if (identityDocumentFile.startsWith("data:")) {
              identityDocumentFileObj = base64ToFile(
                identityDocumentFile,
                "identity-document.jpg"
              );
            }
          } else if (identityDocumentFile instanceof File) {
            identityDocumentFileObj = identityDocumentFile;
          }
        }

        let userImageUrl: string | undefined;
        let userImagePublicId: string | undefined;
        let identityDocumentUrl: string | undefined;
        let identityDocumentPublicId: string | undefined;

        // Step 3: Upload user image to Cloudinary
        if (userImageFileObj) {
          try {
            const result = await uploadAndExtract(
              userImageFileObj,
              "user_images"
            );
            userImageUrl = result.url;
            userImagePublicId = result.public_id;
          } catch (err: any) {
            return {
              ok: false,
              message:
                "Failed to upload user image: " +
                (err.message || "Unknown error"),
            };
          }
        } else {
          return {
            ok: false,
            message: "User image not provided or invalid.",
          };
        }

        // Step 4: Upload identity document to Cloudinary
        if (identityDocumentFileObj) {
          try {
            const result = await uploadAndExtract(
              identityDocumentFileObj,
              "identity_documents"
            );
            identityDocumentUrl = result.url;
            identityDocumentPublicId = result.public_id;
          } catch (err: any) {
            return {
              ok: false,
              message:
                "Failed to upload identity document: " +
                (err.message || "Unknown error"),
            };
          }
        } else {
          return {
            ok: false,
            message: "Identity document not provided or invalid.",
          };
        }

        // Step 5: Update Firebase Auth profile
        try {
          await updateProfile(firebaseUser, {
            displayName: name,
            photoURL: userImageUrl,
          });
          // Set custom claim for role
          const adminApp = getOrInitAdminApp();
          if (adminApp) {
            const adminAuth = adminApp.auth();
            await adminAuth.setCustomUserClaims(firebaseUser.uid, { role });
          }
        } catch (err: any) {
          return {
            ok: false,
            message:
              "Failed to update user profile: " +
              (err.message || "Unknown error"),
          };
        }
        // Step 6: Get ID token
        let idToken: string | null = null;
        try {
          // Re-fetch ID token to ensure custom claims are present
          idToken = await firebaseUser.getIdToken(true);
        } catch (err: any) {
          return {
            ok: false,
            message:
              "Failed to get authentication token: " +
              (err.message || "Unknown error"),
          };
        }

        // Step 7: Save user data in Firestore (use Firebase UID for hash)
        const db = getFirestore(firebaseApp);
        // Step 8: Generate hash of user data (include idNumber)
        const userDataHash = generateUserDataHash({
          uid: firebaseUser.uid,
          name,
          emailAddress,
          userImage:
            userImageUrl && userImagePublicId
              ? { url: userImageUrl, public_id: userImagePublicId }
              : null,
          phoneNumber,
          userAddress,
          dateOfBirth,
          identityDocument:
            identityDocumentUrl && identityDocumentPublicId
              ? {
                  url: identityDocumentUrl,
                  public_id: identityDocumentPublicId,
                }
              : null,
          verificationStatus: verificationStatus || null,
          createdAt: new Date().toISOString(),
          idNumber: idNumber || null, // include Aadhaar in hash
        });

        const userDoc = {
          uid: firebaseUser.uid,
          name,
          emailAddress,
          userImage:
            userImageUrl && userImagePublicId
              ? { url: userImageUrl, public_id: userImagePublicId }
              : null,
          phoneNumber,
          userAddress,
          dateOfBirth,
          identityDocument:
            identityDocumentUrl && identityDocumentPublicId
              ? {
                  url: identityDocumentUrl,
                  public_id: identityDocumentPublicId,
                }
              : null,
          verificationStatus: verificationStatus || null,
          createdAt: new Date().toISOString(),
          hash: userDataHash,
          role,
          idNumber: idNumber || null, // save Aadhaar in user doc
        };

        try {
          await addDoc(collection(db, "users"), userDoc);
        } catch (err: any) {
          return {
            ok: false,
            message:
              "Failed to save user data to Firestore: " +
              (err.message || "Unknown error"),
          };
        }

        // Step 9: Save hash to blockchain using uploadHash utility
        const blockchainResult = await uploadHash(userDataHash);

        // Step 10: Return success with session cookie
        let sessionCookie: string | undefined = undefined;
        try {
          // Only run admin SDK code on server
          if (typeof window === "undefined") {
            let adminApp = getOrInitAdminApp();
            if (adminApp) {
              const adminAuth = adminApp.auth();
              const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
              sessionCookie = await adminAuth.createSessionCookie(idToken!, {
                expiresIn,
              });
            }
          }
        } catch (err: any) {
          sessionCookie = undefined;
        }
        return {
          ok: true,
          message: "User created and hash uploaded to blockchain!",
          sessionCookie,
        };
      }
      return {
        ok: false,
        message: err?.message || "Failed to create user.",
      };
    }
    const firebaseUser: FirebaseUser = userCredential.user;

    // Check for duplicate Aadhaar number before creating user
    const firestoreDb = getFirestore(firebaseApp);
    if (idNumber) {
      const aadhaarQuery = query(
        collection(firestoreDb, "users"),
        where("idNumber", "==", idNumber)
      );
      const aadhaarSnap = await getDocs(aadhaarQuery);
      if (!aadhaarSnap.empty) {
        return {
          ok: false,
          message: "A user with this Aadhaar number already exists.",
        };
      }
    }

    // Step 2: Prepare files for Cloudinary
    const userImageFileObj =
      typeof userImageFile === "string" && userImageFile.startsWith("data:")
        ? base64ToFile(userImageFile, "user-image.jpg")
        : userImageFile instanceof File
        ? userImageFile
        : undefined;

    let identityDocumentFileObj: File | undefined = undefined;
    if (identityDocumentFile) {
      if (typeof identityDocumentFile === "string") {
        if (identityDocumentFile.startsWith("data:")) {
          identityDocumentFileObj = base64ToFile(
            identityDocumentFile,
            "identity-document.jpg"
          );
        }
      } else if (identityDocumentFile instanceof File) {
        identityDocumentFileObj = identityDocumentFile;
      }
    }

    let userImageUrl: string | undefined;
    let userImagePublicId: string | undefined;
    let identityDocumentUrl: string | undefined;
    let identityDocumentPublicId: string | undefined;

    // Step 3: Upload user image to Cloudinary
    if (userImageFileObj) {
      try {
        const result = await uploadAndExtract(userImageFileObj, "user_images");
        userImageUrl = result.url;
        userImagePublicId = result.public_id;
      } catch (err: any) {
        return {
          ok: false,
          message:
            "Failed to upload user image: " + (err.message || "Unknown error"),
        };
      }
    } else {
      return {
        ok: false,
        message: "User image not provided or invalid.",
      };
    }

    // Step 4: Upload identity document to Cloudinary
    if (identityDocumentFileObj) {
      try {
        const result = await uploadAndExtract(
          identityDocumentFileObj,
          "identity_documents"
        );
        identityDocumentUrl = result.url;
        identityDocumentPublicId = result.public_id;
      } catch (err: any) {
        return {
          ok: false,
          message:
            "Failed to upload identity document: " +
            (err.message || "Unknown error"),
        };
      }
    } else {
      return {
        ok: false,
        message: "Identity document not provided or invalid.",
      };
    }

    // Step 5: Update Firebase Auth profile
    try {
      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: userImageUrl,
      });
      // Set custom claim for role
      const adminApp = getOrInitAdminApp();
      if (adminApp) {
        const adminAuth = adminApp.auth();
        await adminAuth.setCustomUserClaims(firebaseUser.uid, { role });
      }
    } catch (err: any) {
      return {
        ok: false,
        message:
          "Failed to update user profile: " + (err.message || "Unknown error"),
      };
    }
    // Step 6: Get ID token
    let idToken: string | null = null;
    try {
      // Re-fetch ID token to ensure custom claims are present
      idToken = await firebaseUser.getIdToken(true);
    } catch (err: any) {
      return {
        ok: false,
        message:
          "Failed to get authentication token: " +
          (err.message || "Unknown error"),
      };
    }

    // Step 7: Save user data in Firestore
    const db = getFirestore(firebaseApp);
    // Step 8: Generate hash of user data (include idNumber)
    const userDataHash = generateUserDataHash({
      uid: firebaseUser.uid,
      name,
      emailAddress,
      userImage:
        userImageUrl && userImagePublicId
          ? { url: userImageUrl, public_id: userImagePublicId }
          : null,
      phoneNumber,
      userAddress,
      dateOfBirth,
      identityDocument:
        identityDocumentUrl && identityDocumentPublicId
          ? { url: identityDocumentUrl, public_id: identityDocumentPublicId }
          : null,
      verificationStatus: verificationStatus || null,
      createdAt: new Date().toISOString(),
      idNumber: idNumber || null, // include Aadhaar in hash
    });

    const userDoc = {
      uid: firebaseUser.uid,
      name,
      emailAddress,
      userImage:
        userImageUrl && userImagePublicId
          ? { url: userImageUrl, public_id: userImagePublicId }
          : null,
      phoneNumber,
      userAddress,
      dateOfBirth,
      identityDocument:
        identityDocumentUrl && identityDocumentPublicId
          ? { url: identityDocumentUrl, public_id: identityDocumentPublicId }
          : null,
      verificationStatus: verificationStatus || null,
      createdAt: new Date().toISOString(),
      hash: userDataHash, // <-- save the hash in the user document
      role, // <-- save role
      idNumber: idNumber || null, // save Aadhaar in user doc
    };

    try {
      await addDoc(collection(db, "users"), userDoc);
    } catch (err: any) {
      return {
        ok: false,
        message:
          "Failed to save user data to Firestore: " +
          (err.message || "Unknown error"),
      };
    }

    // Step 9: Save hash to blockchain using uploadHash utility
    const blockchainResult = await uploadHash(userDataHash);

    // Step 10: Return success with session cookie
    let sessionCookie: string | undefined = undefined;
    try {
      // Only run admin SDK code on server
      if (typeof window === "undefined") {
        let adminApp = getOrInitAdminApp();
        if (adminApp) {
          const adminAuth = adminApp.auth();
          // Set custom user claims for role
          await adminAuth.setCustomUserClaims(firebaseUser.uid, { role });
          const refreshedToken = await firebaseUser.getIdToken(true);
          const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
          sessionCookie = await adminAuth.createSessionCookie(
            refreshedToken || idToken!,
            { expiresIn }
          );
        }
      }
    } catch (err: any) {
      sessionCookie = undefined;
    }
    return {
      ok: true,
      message: "User created, data saved, and hash uploaded to blockchain! ",
      sessionCookie,
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Unknown error occurred";
    if (
      typeof err?.message === "string" &&
      (err.message.includes("PERMISSION_DENIED") ||
        err.message.includes("Missing or insufficient permissions"))
    ) {
      errorMsg =
        "Firestore permission denied. Please check your Firestore security rules to allow writing to the 'users' collection.";
    }
    return {
      ok: false,
      message: errorMsg,
    };
  }
}

export async function loginUser(
  email: string,
  password: string,
  role = "user"
): Promise<{ ok: boolean; message?: string; sessionCookie?: string }> {
  try {
    getOrInitAdminApp(); // <-- Add this line at the start
    const auth = getAuth(firebaseApp);
    // 1. Find user in Firestore by email and verify role
    const adminDb = getAdminFirestore();
    let userSnap = await adminDb
      .collection("users")
      .where("emailAddress", "==", email)
      .limit(1)
      .get();

    if (userSnap.empty) {
      userSnap = await adminDb
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();
    }

    if (userSnap.empty) {
      return {
        ok: false,
        message: "No user found with this email and role.",
      };
    }
    const userData = userSnap.docs[0].data();
    if (userData.role && userData.role !== role) {
      return {
        ok: false,
        message: "No user found with this email and role.",
      };
    }

    // 2. Use the saved hash from Firestore
    const userDataHash = userData.hash;
    if (!userDataHash) {
      return {
        ok: false,
        message: "No hash found for this user in Firestore.",
      };
    }

    // 3. Check hash on blockchain
    const contract = getContract();
    const hashExists = await contract.verifyHash(userDataHash);
    if (!hashExists) {
      return {
        ok: false,
        message: "User data hash not found on blockchain. Cannot login.",
      };
    }

    // 4. Proceed to Firebase Auth login
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      return {
        ok: false,
        message: "Incorrect credentials.",
      };
    }

    const firebaseUser = userCredential.user;
    let idToken: string | undefined;
    try {
      const adminApp = getOrInitAdminApp();
      if (!adminApp) {
        return {
          ok: false,
          message: "Admin SDK not initialized. Server-side operation required.",
        };
      }
      const adminAuth = adminApp.auth();
      await adminAuth.setCustomUserClaims(firebaseUser.uid, { role });
      // Re-fetch ID token to ensure custom claims are present
      idToken = await firebaseUser.getIdToken(true);
    } catch (err: any) {
      return { ok: false, message: "Failed to get authentication token." };
    }

    // Create session cookie
    const adminApp = getOrInitAdminApp();
    if (!adminApp) {
      return {
        ok: false,
        message: "Admin SDK not initialized. Server-side operation required.",
      };
    }
    const adminAuth = adminApp.auth();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken!, {
      expiresIn,
    });
    return {
      ok: true,
      message: "Login successful! Redirecting to your dashboard...",
      sessionCookie,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: "Server error. Please try again later.",
    };
  }
}

export async function authenticateUserWithSessionCookie(
  sessionCookie?: string
): Promise<{ ok: boolean; user?: any; message?: string }> {
  try {
    getOrInitAdminApp(); // <-- Ensure Admin SDK is initialized at the start
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    let adminApp = getOrInitAdminApp();
    if (!adminApp) {
      return {
        ok: false,
        message: "Admin SDK not initialized. Server-side operation required.",
      };
    }
    const adminAuth = adminApp.auth();
    const adminDb = adminApp.firestore();

    let cookie = sessionCookie;
    if (!cookie) {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookie = cookieStore.get("session")?.value;
      } catch (e) {
        // Not in server request context
      }
    }

    if (!cookie) {
      return {
        ok: false,
        message: "No session cookie found. Please log in.",
        user: null,
      };
    }

    // Verify the session cookie with fallback to ID token verification
    const cleanCookie = typeof cookie === "string"
      ? decodeURIComponent(cookie).trim().replace(/^["']|["']$/g, "")
      : cookie;

    let decodedToken: any;
    try {
      decodedToken = await adminAuth.verifySessionCookie(cleanCookie, false);
    } catch (cookieErr: any) {
      console.warn("verifySessionCookie failed, trying verifyIdToken fallback:", cookieErr?.code, cookieErr?.message);
      try {
        decodedToken = await adminAuth.verifyIdToken(cleanCookie, false);
      } catch (idTokenErr: any) {
        console.error("Both verifySessionCookie and verifyIdToken failed:", {
          sessionErr: cookieErr?.message,
          sessionCode: cookieErr?.code,
          idErr: idTokenErr?.message,
          idCode: idTokenErr?.code,
          cookieLength: cleanCookie?.length,
        });
        return {
          ok: false,
          message: `Invalid or expired session cookie (${cookieErr?.code || "AUTH_ERROR"}): ${cookieErr?.message || "Verification failed"}`,
          user: null,
        };
      }
    }

    const uid = decodedToken.uid;
    const tokenRole = decodedToken.role;

    // Disallow if token explicitly belongs to another role
    if (tokenRole && tokenRole !== "user") {
      return {
        ok: false,
        message: `Unauthorized role for user dashboard. Account has role '${tokenRole}'.`,
        user: null,
      };
    }

    // Fetch user data from Firestore using UID
    let userDocSnap = await adminDb
      .collection("users")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    let userData: any = null;
    let docRef: any = null;
    if (!userDocSnap.empty) {
      docRef = userDocSnap.docs[0].ref;
      userData = userDocSnap.docs[0].data();
    } else {
      // Fallback: Check if document ID is uid
      const directDoc = await adminDb.collection("users").doc(uid).get();
      if (directDoc.exists) {
        docRef = directDoc.ref;
        userData = directDoc.data();
      } else if (decodedToken.email) {
        const emailSnap = await adminDb
          .collection("users")
          .where("emailAddress", "==", decodedToken.email)
          .limit(1)
          .get();
        if (!emailSnap.empty) {
          docRef = emailSnap.docs[0].ref;
          userData = emailSnap.docs[0].data();
          try {
            await docRef.update({ uid });
          } catch (e) {}
        }
      }
    }

    if (!userData) {
      return {
        ok: false,
        message: "User not found in database for this account.",
        user: null,
      };
    }

    // Verify user role
    const userRole = userData.role || "user";
    if (userRole !== "user") {
      return {
        ok: false,
        message: "Account is registered as an organisation, not a user.",
        user: null,
      };
    }

    // Backfill custom claims in auth if not yet present
    if (!tokenRole || tokenRole !== "user") {
      try {
        await adminAuth.setCustomUserClaims(uid, { role: "user" });
      } catch (claimErr) {
        // Non-blocking
      }
    }

    // Convert Firestore Timestamp fields to ISO strings
    if (userData.createdAt) {
      if (userData.createdAt.toDate && typeof userData.createdAt.toDate === "function") {
        userData.createdAt = userData.createdAt.toDate().toISOString();
      } else if (typeof userData.createdAt === "object" && userData.createdAt._seconds) {
        userData.createdAt = new Date(userData.createdAt._seconds * 1000).toISOString();
      }
    }
    // Convert apiKeys array timestamps
    if (Array.isArray(userData.apiKeys)) {
      userData.apiKeys = userData.apiKeys.map((key: any) => {
        let keyDate = key.createdAt;
        if (keyDate) {
          if (keyDate.toDate && typeof keyDate.toDate === "function") {
            keyDate = keyDate.toDate().toISOString();
          } else if (typeof keyDate === "object" && keyDate._seconds) {
            keyDate = new Date(keyDate._seconds * 1000).toISOString();
          }
        }
        return {
          ...key,
          createdAt: keyDate || null,
        };
      });
    }

    // Sanitize to plain object
    userData = JSON.parse(JSON.stringify(userData));

    return {
      ok: true,
      user: userData,
      message: "User authenticated successfully.",
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Authentication failed.";
    return { ok: false, message: errorMsg, user: null };
  }
}

export async function getRoleFromSessionCookie(
  sessionCookie: string
): Promise<{ ok: boolean; role?: string; message?: string }> {
  try {
    getOrInitAdminApp(); // <-- Ensure Admin SDK is initialized at the start
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    const adminApp = getOrInitAdminApp();
    if (!adminApp) {
      return {
        ok: false,
        message: "Admin SDK not initialized. Server-side operation required.",
      };
    }
    const adminAuth = adminApp.auth();
    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie,
      true
    );
    let role = decodedToken.role;

    if (!role) {
      const adminDb = adminApp.firestore();
      // Check in users collection
      let userSnap = await adminDb
        .collection("users")
        .where("uid", "==", decodedToken.uid)
        .limit(1)
        .get();
      if (!userSnap.empty) {
        role = userSnap.docs[0].data().role || "user";
      } else {
        const directUser = await adminDb
          .collection("users")
          .doc(decodedToken.uid)
          .get();
        if (directUser.exists) {
          role = directUser.data()?.role || "user";
        }
      }

      // If not in users, check organisations collection
      if (!role) {
        let orgSnap = await adminDb
          .collection("organisations")
          .where("uid", "==", decodedToken.uid)
          .limit(1)
          .get();
        if (!orgSnap.empty) {
          role = orgSnap.docs[0].data().role || "organisation";
        } else {
          const directOrg = await adminDb
            .collection("organisations")
            .doc(decodedToken.uid)
            .get();
          if (directOrg.exists) {
            role = directOrg.data()?.role || "organisation";
          }
        }
      }

      // Backfill claim if resolved
      if (role) {
        try {
          await adminAuth.setCustomUserClaims(decodedToken.uid, { role });
        } catch (e) {
          // Non-blocking
        }
      }
    }

    if (!role) {
      return { ok: false, message: "Role not found in session cookie." };
    }
    return { ok: true, role, message: `Role is ${role}` };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Failed to determine role from session cookie.",
    };
  }
}

