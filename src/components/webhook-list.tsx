"use client";

import { useState } from "react";
import type { WebhookWithId } from "@/actions/webhooks";
import { WebhookCard } from "./webhook-card";
import { WebhookFormDialog } from "./webhook-form-dialog";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

interface WebhookListProps {
  initialWebhooks: WebhookWithId[];
}

export function WebhookList({ initialWebhooks }: WebhookListProps) {
  const [webhooks, setWebhooks] = useState<WebhookWithId[]>(initialWebhooks);

  const onWebhookCreated = (newWebhook: WebhookWithId) => {
    setWebhooks((prev) => [newWebhook, ...prev]);
  };
  
  const onWebhookUpdated = (updatedWebhook: WebhookWithId) => {
    setWebhooks((prev) => prev.map(w => w.id === updatedWebhook.id ? updatedWebhook : w));
  };
  
  const onWebhookDeleted = (deletedWebhookId: string) => {
    setWebhooks((prev) => prev.filter(w => w.id !== deletedWebhookId));
  }

  return (
    <div className="space-y-6">
      <div className="text-right">
        <WebhookFormDialog onSave={onWebhookCreated}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Webhook
          </Button>
        </WebhookFormDialog>
      </div>

      {webhooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
          <h3 className="text-xl font-semibold">No Webhooks Found</h3>
          <p className="text-muted-foreground mt-2">
            Get started by adding your first AI assistant webhook.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {webhooks.map((webhook) => (
            <WebhookCard key={webhook.id} webhook={webhook} onUpdated={onWebhookUpdated} onDeleted={onWebhookDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
