"use server";

import { relayToWebhook, type RelayToWebhookInput, type RelayToWebhookOutput } from "@/ai/flows/relay-to-webhook";
import { z } from "zod";

const relaySchema = z.object({
    prompt: z.string(),
    webhookUrl: z.string().url(),
    username: z.string().optional(),
    passwordEncrypted: z.string().optional(),
});

export async function relayMessageAction(input: RelayToWebhookInput): Promise<RelayToWebhookOutput> {
    const validatedInput = relaySchema.safeParse(input);
    if (!validatedInput.success) {
        throw new Error("Invalid input for relaying message.");
    }

    try {
        const result = await relayToWebhook(validatedInput.data);
        return result;
    } catch (error) {
        console.error("Error relaying message to webhook:", error);
        throw new Error("Failed to get response from AI assistant.");
    }
}
