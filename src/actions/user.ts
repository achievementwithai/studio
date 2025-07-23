"use server";

import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function updateUserAvatarAction(avatarUrl: string) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated.");
    }

    try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
            avatarUrl: avatarUrl,
        });
    } catch (error) {
        console.error("Error updating avatar:", error);
        throw new Error("Failed to update avatar.");
    }
}
