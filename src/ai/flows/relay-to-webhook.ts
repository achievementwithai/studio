'use server';

/**
 * @fileOverview Relays user prompts to a configured webhook and returns the AI's response.
 *
 * - relayToWebhook - A function that relays the prompt to the webhook and returns the AI response.
 * - RelayToWebhookInput - The input type for the relayToWebhook function.
 * - RelayToWebhookOutput - The return type for the relayToWebhook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RelayToWebhookInputSchema = z.object({
  prompt: z.string().describe('The user prompt to relay to the webhook.'),
  webhookUrl: z.string().url().describe('The URL of the webhook to send the prompt to.'),
  username: z.string().optional().describe('The username for Basic Authentication (optional).'),
  passwordEncrypted: z.string().optional().describe('The encrypted password for Basic Authentication (optional).'),
});
export type RelayToWebhookInput = z.infer<typeof RelayToWebhookInputSchema>;

const RelayToWebhookOutputSchema = z.object({
  aiResponse: z.string().describe('The AI response received from the webhook.'),
});
export type RelayToWebhookOutput = z.infer<typeof RelayToWebhookOutputSchema>;

export async function relayToWebhook(input: RelayToWebhookInput): Promise<RelayToWebhookOutput> {
  return relayToWebhookFlow(input);
}

const relayToWebhookFlow = ai.defineFlow(
  {
    name: 'relayToWebhookFlow',
    inputSchema: RelayToWebhookInputSchema,
    outputSchema: RelayToWebhookOutputSchema,
  },
  async input => {
    const {
      prompt,
      webhookUrl,
      username,
      passwordEncrypted,
    } = input;

    //  * Fetch and decrypt webhook credentials from Firestore (omitted here, assuming they are passed in).
    //  * Send an HTTP POST to the N8N webhook URL with Basic Auth header.
    //  * Return the webhook’s AI response.

    // This is a placeholder implementation.  A real implementation would:
    // 1. Decrypt the passwordEncrypted using a secure method (e.g., Cloud KMS).
    // 2. Make an HTTP request to the webhook URL, including the prompt in the body and the Basic Auth header if username and password are provided.
    // 3. Parse the response from the webhook and extract the AI response.

    // For this example, we'll just return a canned response.
    const aiResponse = `AI response for prompt: ${prompt}`;

    return { aiResponse };
  }
);
