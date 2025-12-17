import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const chatBubbleVariant = cva("flex gap-2 max-w-[80%]", {
  variants: {
    variant: {
      received: "self-start",
      sent: "self-end flex-row-reverse",
    },
    layout: {
      default: "",
      ai: "max-w-full",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

const chatBubbleMessageVariant = cva(
  "p-4 rounded-lg text-sm font-medium shadow-sm relative",
  {
    variants: {
      variant: {
        received:
          "bg-white text-gray-800 border border-gray-200 rounded-tl-none",
        sent: "bg-primary text-primary-foreground border border-primary rounded-tr-none ml-auto",
      },
      layout: {
        default: "",
        ai: "bg-white text-gray-800 border border-gray-200",
      },
    },
    defaultVariants: {
      variant: "received",
      layout: "default",
    },
  },
);

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
  layout?: "default" | "ai";
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, layout, children, ...props }, ref) => (
    <div
      className={cn(
        chatBubbleVariant({ variant, layout, className }),
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
);
ChatBubble.displayName = "ChatBubble";

interface ChatBubbleAvatarProps {
  src?: string;
  fallback?: string;
  children?: React.ReactNode;
  className?: string;
}

const ChatBubbleAvatar: React.FC<ChatBubbleAvatarProps> = ({
  src,
  fallback,
  children,
  className,
}) => (
  <Avatar className={cn("h-8 w-8", className)}>
    <AvatarImage src={src} alt="Avatar" />
    <AvatarFallback className="bg-transparent border-0 flex items-center justify-center">
      {children || fallback}
    </AvatarFallback>
  </Avatar>
);

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariant> {
  isLoading?: boolean;
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(({ className, variant, layout, isLoading, children, ...props }, ref) => {
  const isBot = variant === "received";
  
  return (
    <div
      className={cn(chatBubbleMessageVariant({ variant, layout, className }))}
      style={{
        backgroundColor: isBot ? `hsl(var(--athena-message-bot-bg))` : `hsl(var(--athena-message-user-bg))`,
        color: isBot ? `hsl(var(--athena-message-bot-text))` : `hsl(var(--athena-message-user-text))`,
        border: `1px solid hsl(var(--athena-chat-border))`
      }}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="flex space-x-1">
          <div 
            className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]"
            style={{ backgroundColor: `hsl(var(--athena-message-loading-dot))` }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]"
            style={{ backgroundColor: `hsl(var(--athena-message-loading-dot))` }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: `hsl(var(--athena-message-loading-dot))` }}
          ></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
});
ChatBubbleMessage.displayName = "ChatBubbleMessage";

export { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage };
