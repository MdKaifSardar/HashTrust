"use server"

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, User as FirebaseUser } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "../models/user.model";

// Use environment variables for Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID!
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export interface CreateUserResult {
  user: User | null;
  idToken: string | null;
  error: string | null;
}

export async function createUser(
  name: string,
  emailAddress: string,
  password: string,
  userImageFile?: File,
  phoneNumber?: string,
  userAddress?: string,
  dateOfBirth?: string,
  identityDocumentFile?: File
): Promise<CreateUserResult> {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, emailAddress, password);
    const firebaseUser: FirebaseUser = userCredential.user;

    let userImageUrl: string | undefined = undefined;
    let identityDocumentUrl: string | undefined = undefined;

    // Upload user image (visible user photo)
    if (userImageFile) {
      try {
        const ext = userImageFile.type.split("/")[1] || "jpg";
        const imageRef = ref(storage, `users/${firebaseUser.uid}/userImage.${ext}`);
        await uploadBytes(imageRef, userImageFile);
        userImageUrl = await getDownloadURL(imageRef);
      } catch (err: any) {
        return {
          user: null,
          idToken: null,
          error: "Failed to upload user image: " + (err.message || "Unknown error"),
        };
      }
    }

    // Upload identity document (Aadhaar card or similar)
    if (identityDocumentFile) {
      try {
        const ext = identityDocumentFile.type.split("/")[1] || "pdf";
        const docRef = ref(storage, `users/${firebaseUser.uid}/identityDocument.${ext}`);
        await uploadBytes(docRef, identityDocumentFile);
        identityDocumentUrl = await getDownloadURL(docRef);
      } catch (err: any) {
        return {
          user: null,
          idToken: null,
          error: "Failed to upload identity document: " + (err.message || "Unknown error"),
        };
      }
    }

    // Update Firebase Auth profile
    await updateProfile(firebaseUser, {
      displayName: name,
      photoURL: userImageUrl,
    });

    const idToken = await firebaseUser.getIdToken();

    return {
      user: {
        uid: firebaseUser.uid,
        name,
        emailAddress,
        userImage: userImageUrl,
        phoneNumber,
        userAddress,
        dateOfBirth,
        identityDocument: identityDocumentUrl,
      },
      idToken,
      error: null,
    };
  } catch (err: any) {
    return {
      user: null,
      idToken: null,
      error: err.message || "Unknown error occurred",
    };
  }
}