import { getWebhooksAction } from "@/actions/webhooks";
import { ChatInterface } from "@/components/chat-interface";
import { MessageSquare } from "lucide-react";

export default async function ChatPage() {
    const webhooks = await getWebhooksAction();

    return (
        <div className="h-full flex flex-col">
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-8 w-8" />
                    Chat
                </h1>
                <p className="text-muted-foreground">
                    Select an assistant and start a conversation.
                </p>
            </div>
            <div className="flex-grow mt-6">
                <ChatInterface webhooks={webhooks} />
            </div>
        </div>
    );
}
