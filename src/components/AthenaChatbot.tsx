import React, { useState, FormEvent, useEffect, useRef, useMemo } from 'react';
import { Send, Icon, UserRound, Maximize2, Minimize2 } from 'lucide-react';
import { owl } from '@lucide/lab';
import { ExpandableChat, ExpandableChatHeader, ExpandableChatBody, ExpandableChatFooter } from '@/components/ui/expandable-chat';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatInput } from '@/components/ui/chat-input';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useCalc } from '@/contexts/CalcContext';
import { ROUND_MANAGEMENT_RANGE_NAMES } from '@/Sim/RangeNameMap';
import { UI_TEXT } from '@/Sim/Content';

// Flowise API Configuration
const DEFAULT_API_HOST = "https://ai.btsmomenta.com";
const DEFAULT_CHATFLOW_ID = "7707273e-f35c-42bb-9dae-f807e20dab45";
const SESSION_PATTERN_ID = "e5c3c888-101b-4d4e-b0be-62082d8055c8";
const API_BASE_URL = `${DEFAULT_API_HOST}/api/v1/`;
const EVENT_TITLE = "CoverMyMeds_Simulation";

interface Message {
  message: string;
  type: 'userMessage' | 'apiMessage';
  isTyping?: boolean;
}

interface FlowiseHistoryMessage {
  role: string;
  content: string;
}

export const AthenaChatbot: React.FC = () => {
  const { getValue } = useCalc();
  const [messages, setMessages] = useState<Message[]>([
    { 
      message: UI_TEXT.ATHENA.WELCOME_MESSAGE, 
      type: 'apiMessage' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get team number from calc to use as participant ID
  const teamNumber = getValue(ROUND_MANAGEMENT_RANGE_NAMES.TEAM_NUMBER) || "1234567890";
  const currentRound = getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1';

  // Generate unique session ID based on participant and round
  const sessionId = useMemo(() => {
    const participantId = teamNumber;
    const roundNum = parseInt(currentRound);
    return `${SESSION_PATTERN_ID}${participantId}${EVENT_TITLE}_R${roundNum}`;
  }, [teamNumber, currentRound]);

  // Load existing conversation history from Flowise
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        // Include sessionId as query parameter to fetch session-specific messages
        const res = await fetch(
          `${API_BASE_URL}chatmessage/${DEFAULT_CHATFLOW_ID}?sessionId=${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: abortController.signal
          }
        );
        
        if (res.ok) {
          const body = await res.json();
          if (Array.isArray(body) && body.length > 0) {
            // Convert Flowise format to our message format
            // Flowise uses "user" and "assistant" roles, we use "userMessage" and "apiMessage"
            const historyMessages = body
              .filter((m: FlowiseHistoryMessage) => m.content && m.role)
              .map((m: FlowiseHistoryMessage) => ({
                message: m.content,
                type: m.role === 'user' ? 'userMessage' as const : 'apiMessage' as const
              }));
            
            if (historyMessages.length > 0) {
              setMessages(historyMessages);
            }
          }
        } else if (res.status !== 404) {
          // 404 is expected for new sessions, don't log as error
          console.warn('Failed to load chat history:', res.status, res.statusText);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Failed to load chat history:', error);
        }
        // Keep default welcome message on error
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    fetchHistory();
    
    // Cleanup: abort fetch if component unmounts or sessionId changes
    return () => {
      abortController.abort();
    };
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async (e: FormEvent, customInput?: string) => {
    e.preventDefault();
    const messageText = customInput || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      message: messageText,
      type: 'userMessage'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Add typing indicator
    setMessages(prev => [...prev, { message: '', type: 'apiMessage', isTyping: true }]);
    setIsLoading(true);

    try {
      // Convert message history to Flowise format (role/content pairs)
      const flowiseHistory = messages
        .filter(m => !m.isTyping)
        .map(m => ({
          role: m.type === 'userMessage' ? 'user' : 'assistant',
          content: m.message
        }));

      const payload = {
        question: messageText,
        history: flowiseHistory,
        overrideConfig: {
          sessionId: sessionId,
          pineconeMetadataFilter: {
            "$or": [
              { "allRound": { "$eq": "all" } },
              { "filter": { "$eq": parseInt(currentRound).toString() } }
            ]
          }
        }
      };

      const res = await fetch(`${API_BASE_URL}prediction/${DEFAULT_CHATFLOW_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const result = await res.json();
      
      // Remove typing indicator and add real response
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length && updated[updated.length - 1].isTyping) {
          updated.pop();
        }
        updated.push({
          message: String(result?.text ?? "I'm sorry, I couldn't process that request."),
          type: 'apiMessage'
        });
        return updated;
      });
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Remove typing indicator and show error message
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length && updated[updated.length - 1].isTyping) {
          updated.pop();
        }
        updated.push({
          message: "I'm having trouble connecting right now. Please try again in a moment.",
          type: 'apiMessage'
        });
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendPrompt = async (promptText: string) => {
    if (isLoading) return;
    // Pass the prompt text directly to handleSubmit to avoid state timing issues
    const fakeEvent = { preventDefault: () => {} } as FormEvent;
    await handleSubmit(fakeEvent, promptText);
  };

  return (
    <ExpandableChat position="bottom-left" size={isExpanded ? "xl" : "md"}>
      <ExpandableChatHeader>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Icon iconNode={owl} className="text-white" size={18} />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-semibold text-white">Minerva</h3>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpansion}
          className="absolute right-10 w-6 h-6 z-20 text-white hover:text-white/80 hover:bg-white/20"
          title={isExpanded ? "Contract Chat" : "Expand Chat"}
          aria-label={isExpanded ? "Contract chat" : "Expand chat"}
        >
          {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </Button>
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ChatMessageList>
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                </div>
                <p className="text-sm text-gray-500">Loading conversation history...</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatBubble
                  key={index}
                  variant={message.type === 'userMessage' ? 'sent' : 'received'}
                >
                  {message.type === 'apiMessage' && (
                    <ChatBubbleAvatar className="bg-white border border-gray-200">
                      <Icon iconNode={owl} className="text-gray-900" size={18} />
                    </ChatBubbleAvatar>
                  )}
                  {message.type === 'userMessage' && (
                    <ChatBubbleAvatar className="bg-white border border-gray-200">
                      <UserRound className="text-gray-900" size={18} />
                    </ChatBubbleAvatar>
                  )}
                  <ChatBubbleMessage
                    variant={message.type === 'userMessage' ? 'sent' : 'received'}
                    isLoading={message.isTyping}
                  >
                    {!message.isTyping && message.type === 'apiMessage' ? (
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                        }}
                      >
                        {message.message}
                      </ReactMarkdown>
                    ) : !message.isTyping ? (
                      message.message
                    ) : null}
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter>
        {/* Quick-reply prompt buttons */}
        {UI_TEXT.ATHENA.QUICK_PROMPTS.length > 0 && !isLoadingHistory && (
          <div className="flex flex-wrap gap-2 mb-2">
            {UI_TEXT.ATHENA.QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendPrompt(prompt)}
                disabled={isLoading || isLoadingHistory}
                className="text-xs px-3 py-1.5 rounded-full bg-[hsl(var(--athena-primary))] text-white hover:opacity-90 disabled:opacity-50 transition-opacity border border-[hsl(var(--athena-button-border))]/30"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoadingHistory ? "Loading..." : "Ask Minerva anything..."}
            className="flex-1"
            disabled={isLoading || isLoadingHistory}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || isLoadingHistory || !input.trim()}
            style={{ backgroundColor: `hsl(var(--athena-primary))` }}
            className="hover:opacity-90"
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
};
