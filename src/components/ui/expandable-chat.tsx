"use client";

import React, { useRef, useState } from "react";
import { X, Icon } from "lucide-react";
import { owl } from "@lucide/lab";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ChatPosition = "bottom-right" | "bottom-left";
export type ChatSize = "sm" | "md" | "lg" | "xl" | "full";

const chatConfig = {
  dimensions: {
    sm: "sm:max-w-sm sm:max-h-[500px]",
    md: "sm:max-w-md sm:max-h-[600px]",
    lg: "sm:max-w-lg sm:max-h-[700px]",
    xl: "sm:max-w-xl sm:max-h-[800px]",
    full: "sm:w-full sm:h-full",
  },
  positions: {
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
  },
  chatPositions: {
    "bottom-right": "sm:bottom-[calc(100%+10px)] sm:left-64",
    "bottom-left": "sm:bottom-[calc(100%+10px)] sm:left-0",
  },
  states: {
    open: "pointer-events-auto opacity-100 visible scale-100 translate-y-0",
    closed:
      "pointer-events-none opacity-0 invisible scale-100 sm:translate-y-5",
  },
};

interface ExpandableChatProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: ChatPosition;
  size?: ChatSize;
  icon?: React.ReactNode;
}

interface ExpandableChatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

const ExpandableChat: React.FC<ExpandableChatProps> = ({
  className,
  position = "bottom-left",
  size = "md",
  icon,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div
      className={cn(`fixed ${chatConfig.positions[position]} z-50`, className)}
      {...props}
    >
      <div
        ref={chatRef}
        className={cn(
          "flex flex-col border-2 sm:rounded-lg shadow-2xl overflow-hidden transition-all duration-250 ease-out sm:absolute sm:w-[90vw] sm:h-[80vh] fixed inset-0 w-full h-full sm:inset-auto backdrop-blur-md ring-1 ring-black/10",
          chatConfig.chatPositions[position],
          chatConfig.dimensions[size],
          isOpen ? chatConfig.states.open : chatConfig.states.closed,
          className,
        )}
        style={{ 
          backgroundColor: `hsl(var(--athena-chat-bg))`,
          borderColor: `hsl(var(--athena-chat-border))`,
          boxShadow: `0 25px 50px -12px hsl(var(--athena-chat-shadow) / 0.25)`
        }}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === ExpandableChatHeader) {
            return React.cloneElement(child, { onClose: toggleChat } as any);
          }
          return child;
        })}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 sm:hidden"
          onClick={toggleChat}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ExpandableChatToggle
        icon={icon}
        isOpen={isOpen}
        toggleChat={toggleChat}
      />
    </div>
  );
};

ExpandableChat.displayName = "ExpandableChat";

const ExpandableChatHeader: React.FC<ExpandableChatHeaderProps> = ({
  className,
  onClose,
  children,
  ...props
}) => (
  <div
    className={cn("flex items-center justify-between px-4 py-3 border-b", className)}
    style={{ 
      backgroundColor: `hsl(var(--athena-primary))`,
      borderColor: `hsl(var(--athena-chat-border))`,
      color: `hsl(var(--athena-chat-header-text))`
    }}
    {...props}
  >
    <div className="flex items-center">
      {children}
    </div>
    {onClose && (
      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6 text-white hover:text-white/80 hover:bg-white/20"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </Button>
    )}
  </div>
);

ExpandableChatHeader.displayName = "ExpandableChatHeader";

const ExpandableChatBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div 
  className={cn("flex-grow overflow-y-auto", className)} 
  style={{ backgroundColor: `hsl(var(--athena-chat-bg))` }}
  {...props} 
/>;

ExpandableChatBody.displayName = "ExpandableChatBody";

const ExpandableChatFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div 
  className={cn("border-t px-3 py-2", className)} 
  style={{ 
    backgroundColor: `hsl(var(--athena-chat-bg))`,
    borderColor: `hsl(var(--athena-chat-border))`
  }}
  {...props} 
/>;

ExpandableChatFooter.displayName = "ExpandableChatFooter";

interface ExpandableChatToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  isOpen: boolean;
  toggleChat: () => void;
}

const ExpandableChatToggle: React.FC<ExpandableChatToggleProps> = ({
  className,
  icon,
  isOpen,
  toggleChat,
  ...props
}) => (
  <button
    onClick={toggleChat}
    className={cn(
      "athena-glow-button relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500",
      className,
    )}
    style={{
      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
    }}
    {...props}
  >
    {isOpen ? (
      <X className="h-6 w-6 text-white relative z-10" />
    ) : (
      icon || <Icon iconNode={owl} className="h-6 w-6 text-white relative z-10" />
    )}
  </button>
);

ExpandableChatToggle.displayName = "ExpandableChatToggle";

export {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
}

// Add custom styles for Athena using CSS variables - theme independent
const styles = `
  .athena-glow-button {
    box-sizing: border-box !important;
    background: hsl(var(--athena-primary)) !important;
    border: 2px solid hsl(var(--athena-button-border)) !important;
    border-radius: 50% !important;
    position: relative !important;
    overflow: visible !important;
    box-shadow: 0 0 5px hsl(var(--athena-button-glow) / 0.7), 0 0 10px hsl(var(--athena-primary-light) / 0.5) !important;
    transition: all 0.3s ease !important;
  }
  
  .athena-glow-button::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: inherit;
    z-index: -1;
    filter: blur(8px);
    opacity: 0.6;
    animation: pulse 2s ease-in-out infinite alternate;
  }
  
  .athena-glow-button:hover {
    box-shadow: 0 0 30px hsl(var(--athena-button-glow) / 0.9), 0 0 50px hsl(var(--athena-primary-light) / 0.7) !important;
  }
  
  .athena-glow-button svg {
    color: white !important;
    fill: none !important;
  }
  
  @keyframes pulse {
    0% {
      opacity: 0.6;
      transform: scale(1);
    }
    100% {
      opacity: 0.8;
      transform: scale(1.02);
    }
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.id = "athena-chat-styles";
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  
  // Remove existing styles if any
  const existingStyle = document.getElementById("athena-chat-styles");
  if (existingStyle) {
    existingStyle.remove();
  }
  
  document.head.appendChild(styleSheet);
}
