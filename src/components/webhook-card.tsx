"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, KeyRound, Trash2 } from "lucide-react";
import type { WebhookWithId } from "@/actions/webhooks";
import { WebhookFormDialog } from "./webhook-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteWebhookAction } from "@/actions/webhooks";
import { useToast } from "@/hooks/use-toast";


interface WebhookCardProps {
  webhook: WebhookWithId;
  onUpdated: (webhook: WebhookWithId) => void;
  onDeleted: (webhookId: string) => void;
}

export function WebhookCard({ webhook, onUpdated, onDeleted }: WebhookCardProps) {
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            await deleteWebhookAction(webhook.id);
            onDeleted(webhook.id);
            toast({
                title: "Webhook Deleted",
                description: `"${webhook.name}" has been successfully deleted.`,
            });
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: error instanceof Error ? error.message : "Could not delete webhook.",
            });
        }
    }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{webhook.name}</CardTitle>
        <CardDescription>
          {webhook.createdAt && `Created on ${new Date(webhook.createdAt.seconds * 1000).toLocaleDateString()}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
          <div className="flex-1 break-all">
            <p className="text-sm font-medium">URL</p>
            <p className="text-sm text-muted-foreground">{webhook.url}</p>
          </div>
        </div>
         <div className="flex items-center gap-3">
            <KeyRound className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <p className="text-sm font-medium">Authentication</p>
            <Badge variant={webhook.auth.username ? "secondary" : "outline"}>
              {webhook.auth.username ? "Enabled" : "Disabled"}
            </Badge>
          </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
         <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the webhook "{webhook.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <WebhookFormDialog webhook={webhook} onSave={onUpdated}>
            <Button variant="outline">Edit</Button>
        </WebhookFormDialog>
      </CardFooter>
    </Card>
  );
}
