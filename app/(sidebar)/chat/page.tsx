"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Sparkles, BrainCircuit, User } from "lucide-react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const suggestedPrompts = [
  "I'm feeling anxious today",
  "Help me with stress management",
  "I'm having trouble sleeping",
  "Tell me about mindfulness",
  "I feel overwhelmed",
  "Help me build confidence",
];

export default function ChatPage() {
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  
  // Fetch journal entries for context
  const journalEntries = useQuery(api.journal.getEntries, user ? { userId: user.id } : "skip");
  
  const [journalContext, setJournalContext] = useState("");

  useEffect(() => {
    if (journalEntries) {
      const recent = journalEntries.slice(0, 5);
      const context = recent.map(e => `[${new Date(e.createdAt).toLocaleDateString()}] ${e.content}`).join("\n");
      setJournalContext(context);
    }
  }, [journalEntries]);

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
    body: {
      journalContext,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const isEmptyChat = messages.length === 0;

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-4xl h-full flex flex-col pt-4 relative z-10">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scroll-smooth">
          {isEmptyChat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center mt-20">
              <div className="mb-8 relative">
                 <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                <div className="relative h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <BrainCircuit className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 font-serif">
                Hi, {user?.firstName || "Friend"}
              </h3>
              <p className="text-muted-foreground text-base max-w-md mb-8">
                I'm your personal mental wellness companion. I can help you process thoughts, practice mindfulness, or just listen.
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
                {suggestedPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="p-4 text-left text-sm border bg-background/50 hover:bg-background hover:shadow-md transition-all rounded-xl group backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 group-hover:scale-110 transition-transform">
                         <MessageCircle className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-foreground/80 group-hover:text-foreground">{prompt}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                
                {message.role !== "user" && (
                   <Avatar className="h-8 w-8 mt-1 border shadow-sm">
                      <AvatarImage src="/logo.png" />
                      <AvatarFallback><BrainCircuit className="h-4 w-4 text-blue-600" /></AvatarFallback>
                   </Avatar>
                )}

                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] space-y-1`}>
                   <div className="flex items-center gap-2 px-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {message.role === "user" ? "You" : "MindChain AI"}
                      </span>
                   </div>
                  <div
                    className={`rounded-2xl px-5 py-3.5 shadow-sm text-base leading-relaxed ${ 
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white dark:bg-muted border rounded-tl-none"
                    }`}>
                     {message.parts.map((part, idx) => {
                      if (part.type === "thinking") {
                        return (
                          <div key={idx} className="text-sm text-gray-500 italic">
                            💭 Thinking: {part.content}
                          </div>
                        );
                      }
                      if (part.type === "text") {
                        return <Streamdown key={idx}>{part.content}</Streamdown>
                      }
                      return null;
                    })}
                  </div>
                </div>

                {message.role === "user" && (
                   <Avatar className="h-8 w-8 mt-1 border shadow-sm">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                   </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && messages[messages.length - 1]?.role === "user" && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 justify-start">
                 <Avatar className="h-8 w-8 mt-1 border shadow-sm">
                    <AvatarFallback><BrainCircuit className="h-4 w-4 text-blue-600" /></AvatarFallback>
                 </Avatar>
                 <div className="bg-white dark:bg-muted border rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1.5 h-12">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                 </div>
             </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 pb-6">
          <div className="glass-card rounded-2xl p-2 pr-2 flex items-end gap-2 bg-background/80 relative z-20 shadow-lg border-t md:border">
            <textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 max-h-32 min-h-[56px] bg-transparent border-none resize-none focus:ring-0 p-4 text-base placeholder:text-muted-foreground/70"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="pb-2 pr-2">
                <Button
                  onClick={(e) => handleSubmit(e as any)}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
                  <Send className="h-5 w-5 text-white" />
                </Button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5 opacity-70">
            <Sparkles className="h-3 w-3" />
            AI-generated content may be inaccurate.
          </p>
        </div>
      </div>
    </div>
  );
}
