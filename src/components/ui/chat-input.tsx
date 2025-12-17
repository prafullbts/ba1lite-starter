import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, rows = 1, style, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const form = e.currentTarget.form;
        if (form) {
          form.requestSubmit();
        }
      }
      onKeyDown?.(e);
    };

    return (
      <Textarea
        autoComplete="off"
        ref={ref}
        name="message"
        rows={rows}
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-8 px-4 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center resize-none border",
          className,
        )}
        style={{
          backgroundColor: `hsl(var(--background))`,
          borderColor: `hsl(var(--border))`,
          color: `hsl(var(--foreground))`,
          ...style
        }}
        {...props}
      />
    );
  },
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
