import { getWebhooksAction } from "@/actions/webhooks";
import { WebhookList } from "@/components/webhook-list";
import { Webhook } from "lucide-react";

export default async function WebhooksPage() {
  const initialWebhooks = await getWebhooksAction();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Webhook className="h-8 w-8" />
            Webhook Management
          </h1>
          <p className="text-muted-foreground">
            Add, edit, and delete your AI assistant webhooks.
          </p>
        </div>
      </div>
      <WebhookList initialWebhooks={initialWebhooks} />
    </div>
  );
}
