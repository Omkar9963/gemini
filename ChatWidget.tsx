
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import type { ChatMessage } from '../types';
import * as GeminiService from '../services/geminiService';
import { Button } from './Button';
import { Input } from './Input';
import { Loader } from './Loader';

// SVG Icons (Heroicons)
const ChatBubbleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.68-3.091a4.501 4.501 0 00-3.208-1.186H6.644ADJc-.833 0-1.603-.423-2.071-1.123L2.25 10.977M8.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.68-3.091a4.501 4.501 0 00-3.208-1.186H.644ADJc-.833 0-1.603-.423-2.071-1.123L-1.75 10.977" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.25c0 2.099.962 3.994 2.484 5.352l-2.101 1.996a.75.75 0 00.233 1.226C4.085 20.128 4.522 20.25 5 20.25h7zm0 0v-2.625m0 0H9.75m2.25 0H12m0 0H9.75m2.25 0H12m0 0H9.75m2.25 0H12m2.484-5.352a8.961 8.961 0 01-2.484 5.352" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);


export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const geminiSystemInstruction = "You are a helpful assistant for a Runoff Estimation Tool. Answer questions clearly and concisely. You can provide information related to hydrology, geography, environmental science, and how such tools generally work. If asked about specific data or analysis results from the tool, explain that you don't have direct access to the tool's current session data but can discuss general concepts.";
      
      // For a chat-like interaction, we should ideally send the history.
      // However, the current `generateText` in `geminiService` takes a single prompt.
      // We'll adapt by sending the new user message as the prompt.
      // A more advanced implementation would modify `geminiService` to support chat history.
      const response = await GeminiService.generateText(
          // For a better chat experience, you might send previous context or a system prompt
          // `Current question: ${trimmedInput}\nPrevious context: ... (summarized)`
          // For now, simple prompt:
          trimmedInput 
          // If you wanted to include a system prompt with each call:
          // `System: ${geminiSystemInstruction}\nUser: ${trimmedInput}`
      );

      const geminiMessage: ChatMessage = {
        id: Date.now().toString() + '-gemini',
        text: response.text,
        sender: 'gemini',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, geminiMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        text: "Sorry, I couldn't get a response. Please try again.",
        sender: 'gemini',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearChat = () => {
    setMessages([]);
     const initialBotMessage: ChatMessage = {
      id: Date.now().toString() + '-init',
      text: "Hello! How can I help you today regarding runoff estimation or related topics?",
      sender: 'gemini',
      timestamp: new Date(),
    };
    setMessages([initialBotMessage]);
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
       handleClearChat(); // Add initial message when chat opens and is empty
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50 transition-transform hover:scale-110"
        aria-label="Open chat"
        title="Open Chat Assistant"
      >
        <ChatBubbleIcon />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-gray-800 text-gray-100 rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-700">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Chat Assistant</h3>
        <div className="flex items-center space-x-2">
            <Button onClick={handleClearChat} variant="secondary" size="sm" title="Clear Chat History">
                Clear
            </Button>
            <button onClick={toggleChat} className="text-gray-400 hover:text-white" aria-label="Close chat">
                <CloseIcon />
            </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto" role="log">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            aria-live={msg.sender === 'gemini' ? 'polite' : undefined}
          >
            <div
              className={`max-w-[80%] p-2.5 rounded-lg shadow ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'} text-right`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-2.5 rounded-lg shadow bg-gray-700 text-gray-200 rounded-bl-none">
              <Loader mini text="Gemini is thinking..." />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 bg-gray-900">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 !bg-gray-700 !border-gray-600"
            aria-label="Chat message input"
            disabled={isLoading}
          />
          <Button type="submit" variant="primary" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
            <SendIcon/>
          </Button>
        </div>
      </form>
    </div>
  );
};
