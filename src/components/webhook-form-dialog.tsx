"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addWebhookAction, updateWebhookAction, type WebhookData, type WebhookWithId } from "@/actions/webhooks";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";

interface WebhookFormDialogProps {
  children: ReactNode;
  webhook?: WebhookWithId;
  onSave: (webhook: WebhookWithId) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Webhook name is required."),
  url: z.string().url("Please enter a valid URL."),
  username: z.string().optional(),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function WebhookFormDialog({ children, webhook, onSave }: WebhookFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: webhook?.name || "",
      url: webhook?.url || "",
      username: webhook?.auth.username || "",
      password: "", // Always empty for security
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: FormValues) {
    const webhookData: WebhookData = {
      name: values.name,
      url: values.url,
      auth: {
        username: values.username || '',
        password: values.password || '', // Password will be empty if not changed
      },
    };

    try {
      let savedWebhook: WebhookWithId;
      if (webhook) {
        savedWebhook = await updateWebhookAction(webhook.id, webhookData);
         toast({
          title: "Webhook Updated",
          description: `"${savedWebhook.name}" has been successfully updated.`,
        });
      } else {
        savedWebhook = await addWebhookAction(webhookData);
         toast({
          title: "Webhook Created",
          description: `"${savedWebhook.name}" has been successfully created.`,
        });
      }
      onSave(savedWebhook);
      setOpen(false);
      form.reset();
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Could not save webhook.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{webhook ? "Edit Webhook" : "Add New Webhook"}</DialogTitle>
          <DialogDescription>
            {webhook ? "Update the details of your webhook." : "Configure a new AI assistant by providing its webhook details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assistant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Custom Assistant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/webhook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basic Auth Username (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="user" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basic Auth Password (Optional)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={webhook ? "Leave blank to keep unchanged" : "••••••••"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                 <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
