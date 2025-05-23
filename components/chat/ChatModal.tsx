"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import styles from "./chatLoading.module.css";
import Markdown from "react-markdown";

interface ChatModalProps {
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const ChatModal = ({ onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! How can I help you today?",
      isUser: false,
      timestamp: moment().format("h:mm"),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    console.log("On Click is working");

    handleChat(inputValue);

    // // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: moment().format("h:mm"),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // // Simulate response after a short delay
    // setTimeout(() => {
    //   const botMessage: Message = {
    //     id: (Date.now() + 1).toString(),
    //     text: "Thanks for your message! Our team will get back to you shortly.",
    //     isUser: false,
    //     timestamp: new Date(),
    //   };
    //   setMessages((prev) => [...prev, botMessage]);
    // }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  //   const formatTime = (date: Date) => {
  //     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  //   };

  const handleChat = async (message: string) => {
    setIsLoading(true);
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer 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",
        "HTTP-Referer": "localhost:3000", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "YOU GOT A MENTOR", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "user",
            content: message || "Hello, how can I help you?",
          },
        ],
      }),
    });

    const data = await res.json();
    console.log(data);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: data.choices[0].message.content,
      isUser: false,
      timestamp: moment().format("h:mm"),
    };
    setIsLoading(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary-light">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>YM</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">YouGotaMentor Chat</h3>
            <p className="text-xs opacity-80">
              We typically reply in a few minutes
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-primary text-white rounded-tr-none"
                  : "bg-white border border-gray-200 rounded-tl-none"
              }`}
            >
              {message.isUser ? (
                <p className="text-sm">{message.text}</p>
              ) : (
                <Markdown>{message.text}</Markdown>
              )}

              <span
                className={`text-xs block mt-1 ${
                  message.isUser ? "text-white" : "text-gray-500"
                }`}
              >
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[75%] p-3 bg-white border border-gray-200 rounded-lg rounded-tr-none">
              {/* <p className="text-sm">...</p> */}
              {/* <span className="text-xs block mt-1 text-gray-500">
                {moment().format("h:mm")}
              </span> */}
              <div className={styles.wrapper}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.shadow}></div>
                <div className={styles.shadow}></div>
                <div className={styles.shadow}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 flex gap-2">
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <Smile className="h-5 w-5 text-gray-500" />
        </Button>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow"
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={handleSendMessage}
          size="icon"
          className="flex-shrink-0 bg-primary hover:bg-primary-dark"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatModal;
