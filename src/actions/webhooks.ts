"use server";

import { db } from "@/lib/firebase";
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

// NOTE: This is a temporary solution for the mock auth system.
// It uses a hardcoded user ID. In a real app, you would get the
// user ID from a secure server-side session.
function getCurrentUserId(): string {
  // Using the mock user's ID.
  return 'mock-user-id';
}

export async function addWebhookAction(data: WebhookData): Promise<WebhookWithId> {
  const userId = getCurrentUserId();
  
  const { password, ...authData } = data.auth;
  const passwordEncrypted = password ? `encrypted_${password}` : undefined;

  const webhookPayload: any = {
    ownerId: userId,
    name: data.name,
    url: data.url,
    auth: {
      username: authData.username,
    },
    createdAt: serverTimestamp(),
  };

  if (passwordEncrypted) {
    webhookPayload.auth.passwordEncrypted = passwordEncrypted;
  }

  const docRef = await addDoc(collection(db, "webhooks"), webhookPayload);
  
  const newDoc = await getDoc(docRef);
  const newWebhook = { id: newDoc.id, ...newDoc.data() } as WebhookWithId;
  
  revalidatePath("/dashboard/webhooks");
  revalidatePath("/dashboard/chat");
  return newWebhook;
}

export async function updateWebhookAction(id: string, data: WebhookData): Promise<WebhookWithId> {
  const userId = getCurrentUserId();
  const docRef = doc(db, "webhooks", id);
  
  const existingDoc = await getDoc(docRef);
  if (!existingDoc.exists() || existingDoc.data().ownerId !== userId) {
    throw new Error("Webhook not found or you do not have permission to edit it.");
  }

  const { password, ...authData } = data.auth;
  const updateData: any = {
      name: data.name,
      url: data.url,
      auth: {
        ...existingDoc.data().auth,
        username: authData.username,
      }
  };

  if (password) {
      updateData.auth.passwordEncrypted = `encrypted_${password}`;
  }


  await updateDoc(docRef, updateData);
  
  const updatedDoc = await getDoc(docRef);
  const updatedWebhook = { id: updatedDoc.id, ...updatedDoc.data() } as WebhookWithId;

  revalidatePath("/dashboard/webhooks");
  revalidatePath("/dashboard/chat");
  return updatedWebhook;
}

export async function deleteWebhookAction(id: string) {
  const userId = getCurrentUserId();
  const docRef = doc(db, "webhooks", id);
  
  // Ensure the user owns this webhook before deleting.
  const existingDoc = await getDoc(docRef);
  if (!existingDoc.exists() || existingDoc.data().ownerId !== userId) {
    throw new Error("Webhook not found or you do not have permission to delete it.");
  }

  await deleteDoc(docRef);
  revalidatePath("/dashboard/webhooks");
  revalidatePath("/dashboard/chat");
}

export async function getWebhooksAction(): Promise<WebhookWithId[]> {
  const userId = getCurrentUserId();
  const q = query(collection(db, "webhooks"), where("ownerId", "==", userId));
  const querySnapshot = await getDocs(q);
  const webhooks: WebhookWithId[] = [];
  querySnapshot.forEach((doc) => {
    webhooks.push({ id: doc.id, ...doc.data() } as WebhookWithId);
  });
  return webhooks.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return b.createdAt.seconds - a.createdAt.seconds;
    }
    return 0;
  });
}
