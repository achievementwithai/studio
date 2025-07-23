"use server";

import { auth, db } from "@/lib/firebase";
import { addDoc, collection, getDocs, query, where, doc, updateDoc, deleteDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export interface WebhookData {
  name: string;
  url: string;
  auth: {
    username: string;
    password?: string;
    passwordEncrypted?: string;
  };
}

export interface WebhookWithId extends WebhookData {
  id: string;
  createdAt: { seconds: number; nanoseconds: number; };
}

// NOTE: In a real app, you would use a proper auth check mechanism
// that's available on the server. For this example, we rely on the
// client to pass the user's UID, which is not secure for production.
// A better approach involves Firebase App Check or custom auth tokens.
function getCurrentUserId(): string {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user.uid;
}

export async function addWebhookAction(data: WebhookData): Promise<WebhookWithId> {
  const userId = getCurrentUserId();
  
  // In a real app, encrypt the password here before storing
  const { password, ...authData } = data.auth;
  const passwordEncrypted = password ? `encrypted_${password}` : '';

  const docRef = await addDoc(collection(db, "webhooks"), {
    ownerId: userId,
    name: data.name,
    url: data.url,
    auth: {
        ...authData,
        passwordEncrypted,
    },
    createdAt: serverTimestamp(),
  });
  
  const newDoc = await getDoc(docRef);
  const newWebhook = { id: newDoc.id, ...newDoc.data() } as WebhookWithId;
  
  revalidatePath("/dashboard/webhooks");
  return newWebhook;
}

export async function updateWebhookAction(id: string, data: WebhookData): Promise<WebhookWithId> {
  const userId = getCurrentUserId();
  const docRef = doc(db, "webhooks", id);
  
  // In a real app, encrypt the password here before storing
  const { password, ...authData } = data.auth;
  const updateData: any = {
      name: data.name,
      url: data.url,
  };

  if(password) {
      updateData['auth.passwordEncrypted'] = `encrypted_${password}`;
  }
  if(authData.username !== undefined){
    updateData['auth.username'] = authData.username;
  }

  await updateDoc(docRef, updateData);
  
  const updatedDoc = await getDoc(docRef);
  const updatedWebhook = { id: updatedDoc.id, ...updatedDoc.data() } as WebhookWithId;

  revalidatePath("/dashboard/webhooks");
  return updatedWebhook;
}

export async function deleteWebhookAction(id: string) {
  const userId = getCurrentUserId();
  // Add a security check here to ensure the user owns the webhook
  await deleteDoc(doc(db, "webhooks", id));
  revalidatePath("/dashboard/webhooks");
}

export async function getWebhooksAction(): Promise<WebhookWithId[]> {
  const userId = getCurrentUserId();
  const q = query(collection(db, "webhooks"), where("ownerId", "==", userId));
  const querySnapshot = await getDocs(q);
  const webhooks: WebhookWithId[] = [];
  querySnapshot.forEach((doc) => {
    webhooks.push({ id: doc.id, ...doc.data() } as WebhookWithId);
  });
  return webhooks.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
}
