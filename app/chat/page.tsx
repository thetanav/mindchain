"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, MessageCircle, Sparkles } from "lucide-react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Streamdown } from "streamdown";

const suggestedPrompts = [
  "I'm feeling anxious today",
  "Help me with stress management",
  "I'm having trouble sleeping",
  "Tell me about mindfulness",
  "I feel overwhelmed",
  "Help me build confidence",
];

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  // Build journal context from localStorage for AI
  const [journalContext, setJournalContext] = useState("");

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem("journalEntries:v1")
          : null;
      const list: any[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return;
      // Sort newest first and take the most recent 8 entries
      list.sort((a, b) => (b?.createdAt ?? 0) - (a?.createdAt ?? 0));
      const recent = list.slice(0, 8);
      const perEntryLimit = 400;
      const lines = recent.map((e: any) => {
        const date =
          (e?.dateISO && new Date(e.dateISO).toISOString().slice(0, 10)) || "";
        const content: string = String(e?.content ?? "")
          .replace(/\s+/g, " ")
          .trim();
        const trimmed =
          content.length > perEntryLimit
            ? content.slice(0, perEntryLimit) + "…"
            : content;
        return `- [${date}] ${trimmed}`;
      });
      const header = "Recent journal entries:";
      const context = [header, ...lines].join("\n");
      // Cap overall length to avoid large payloads
      setJournalContext(context.slice(0, 3000));
    } catch {
      // ignore parse errors
    }
  }, []);

  const { messages, sendMessage, isLoading, error } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
    body: {
      journalContext,
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const isEmptyChat = messages.length === 0;

  return (
    <div className="h-screen pt-24 bg-background">
      <div className="container mx-auto max-w-4xl h-full flex flex-col">
        {/* Chat Container */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isEmptyChat && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center">
                <div className="mb-6">
                  <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    How can I help you today?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    I'm here to provide mental wellness support in a safe,
                    confidential space.
                  </p>
                </div>

                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg">
                  {suggestedPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="p-3 text-left text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                        <span className="text-foreground">{prompt}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {error && (
              <div className="mb-4 text-sm text-red-500">
                {error.message || "Something went wrong while talking to the AI."}
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 mb-6 ${message.role === "user" ? "justify-end" : "justify-start"
                  }`}>
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-muted">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"
                    }`}>
                  <div
                    className={`rounded-lg px-4 py-3 ${message.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-muted"
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
                        // return <span key={idx}>{part.content}</span>;
                        return <Streamdown
                          key={idx}
                        >
                          {part.content}
                        </Streamdown>
                      }
                      return null;
                    })}
                  </div>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-foreground text-background">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 mb-6">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-muted">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border px-6 py-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1">
                <Textarea
                  placeholder="Share what's on your mind..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[44px] max-h-32 resize-none border-border focus:border-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-11 w-11 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>Secure & confidential. AI has access to your journals to answer better.</span>
              </div>
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}