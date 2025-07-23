"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { relayMessageAction } from "@/actions/chat";
import type { WebhookWithId } from "@/actions/webhooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { Bot, Loader2, Send, User } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatInterfaceProps {
  webhooks: WebhookWithId[];
}

export function ChatInterface({ webhooks }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<string | undefined>(webhooks[0]?.id);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedWebhook) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const webhook = webhooks.find(w => w.id === selectedWebhook);
      if (!webhook) throw new Error("Selected webhook not found.");
      
      const response = await relayMessageAction({
        prompt: input,
        webhookUrl: webhook.url,
        username: webhook.auth.username,
        passwordEncrypted: webhook.auth.passwordEncrypted || '',
      });
      
      const aiMessage: Message = { sender: "ai", text: response.aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: "ai", text: "Sorry, I couldn't get a response. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <Select value={selectedWebhook} onValueChange={setSelectedWebhook}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Select an assistant..." />
          </SelectTrigger>
          <SelectContent>
            {webhooks.map((webhook) => (
              <SelectItem key={webhook.id} value={webhook.id}>
                {webhook.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "ai" && (
                  <Avatar>
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                 {message.sender === "user" && (
                  <Avatar>
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
               <div className="flex items-start gap-3">
                 <Avatar>
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                  <div className="max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
            )}
            {messages.length === 0 && !isLoading && (
                 <div className="text-center text-muted-foreground h-full flex items-center justify-center flex-col">
                    <MessageSquare className="h-12 w-12 mb-2"/>
                    <p>No messages yet.</p>
                    <p>Select an assistant and send a message to start.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading || !selectedWebhook}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
// Dummy Card components for compilation
import { Card, CardHeader, CardContent, CardFooter, MessageSquare } from "@/components/ui/card";
