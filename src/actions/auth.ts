"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1),
});

export async function signUpAction(credentials: z.infer<typeof signUpSchema>) {
  const validatedCredentials = signUpSchema.safeParse(credentials);
  if (!validatedCredentials.success) {
    throw new Error("Invalid credentials");
  }

  const { email, password, displayName } = validatedCredentials.data;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Check if this is the first user to assign admin role
    // This is a simplified check. A robust solution would use a separate 'users_count' document or a Cloud Function.
    // For now, we assume this logic needs to be handled manually or via a more complex setup.
    await setDoc(doc(db, "users", user.uid), {
      displayName: displayName,
      email: user.email,
      role: "user", // First user should be manually changed to 'admin' in Firestore
      createdAt: serverTimestamp(),
      avatarUrl: user.photoURL || "",
    });

    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to create account.");
  }
}

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signInAction(credentials: z.infer<typeof signInSchema>) {
  const validatedCredentials = signInSchema.safeParse(credentials);
  if (!validatedCredentials.success) {
    throw new Error("Invalid credentials");
  }

  const { email, password } = validatedCredentials.data;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in.");
  }
}

export async function signOutAction() {
  // This action must be called from a client component that can then handle the redirect.
  // We can't use `auth.signOut()` directly in a server component that reloads the page.
  // The client will call this and then firebase's onAuthStateChanged will handle the rest.
  // In a real server action you would clear cookies/session.
  // With firebase client-side auth, this is more of a placeholder.
  console.log("Sign out action called. Client should handle redirect.");
}
