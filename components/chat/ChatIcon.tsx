"use client";

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatModal from './ChatModal';
// import ChatModal from './ChatModal';

const ChatIcon = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isChatOpen && <ChatModal  />}
      
      <Button
        onClick={toggleChat}
        className={`z-50 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isChatOpen ? 'bg-gray-700' : 'bg-primary'
        }`}
        aria-label="Chat"
      >
        {isChatOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default ChatIcon;