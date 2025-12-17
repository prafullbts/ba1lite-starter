import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Trash2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ai, blobToBase64 } from '../services/gemini';
import { ChatMessage } from '../types';
import { Button, Textarea } from './UI';
import { GenerateContentResponse } from "@google/genai";

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    if (selectedImage) {
      newUserMsg.image = await blobToBase64(selectedImage);
    }

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    // Create a placeholder for the bot response
    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: botMsgId,
      role: 'model',
      text: '', // Start empty
      timestamp: Date.now()
    }]);

    try {
      const model = 'gemini-2.5-flash';
      let resultStream;

      if (selectedImage) {
        // Multimodal request (Non-streaming for simplicity in handling image parts, or streaming if supported)
        // Note: SDK supports streaming with images.
        const base64Data = await blobToBase64(selectedImage);
        resultStream = await ai.models.generateContentStream({
          model,
          contents: {
            parts: [
              { inlineData: { mimeType: selectedImage.type, data: base64Data } },
              { text: input || "Describe this image" }
            ]
          }
        });
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        // Text-only chat
        const chat = ai.chats.create({
          model,
          history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }] // Simplified history
          }))
        });
        resultStream = await chat.sendMessageStream({ message: input });
      }

      let fullText = '';
      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullText += text;
          setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullText } : msg
          ));
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId ? { ...msg, text: "Error: Failed to generate response." } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
            <Bot size={64} className="mb-4" />
            <p className="text-xl font-medium">Start a conversation with Gemini</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`max-w-[80%] space-y-2`}>
              {msg.image && (
                <img 
                  src={`data:image/png;base64,${msg.image}`} 
                  alt="User upload" 
                  className="max-w-full rounded-lg border border-gray-700 shadow-md"
                  style={{ maxHeight: '200px' }}
                />
              )}
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600/20 text-blue-50 border border-blue-500/30' 
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}>
                <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900/90 backdrop-blur">
        {selectedImage && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-gray-800 rounded-lg w-fit">
            <span className="text-xs text-gray-400 truncate max-w-[200px]">{selectedImage.name}</span>
            <button onClick={() => { setSelectedImage(null); if(fileInputRef.current) fileInputRef.current.value='' }} className="text-red-400 hover:text-red-300">
              <Trash2 size={14} />
            </button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <Button 
            variant="secondary" 
            className="p-3 rounded-xl h-[46px]" 
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
          >
            <ImageIcon size={20} />
          </Button>
          
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="pr-10 min-h-[46px] max-h-[150px] py-3"
              rows={1}
            />
          </div>
          
          <Button 
            onClick={handleSend} 
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="h-[46px] w-[46px] p-0 rounded-xl"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
