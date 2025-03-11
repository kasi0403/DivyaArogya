import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const newUserMessage = { id: messages.length + 1, text: inputValue, sender: "user" };
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = { 
        id: messages.length + 2, 
        text: "Thanks for your message! This is a placeholder response. In a real implementation, you would integrate with your chatbot API here.", 
        sender: "bot" 
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">Chat Support</h3>
            <div className="flex gap-2">
              <button 
                onClick={toggleChat} 
                className="text-white hover:text-gray-200 transition"
              >
                <Minimize size={18} />
              </button>
              <button 
                onClick={toggleChat} 
                className="text-white hover:text-gray-200 transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-3 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div 
                  className={`inline-block rounded-lg px-4 py-2 max-w-64 ${
                    message.sender === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="border-t p-3 flex">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Chat Icon Button */}
      <button
        onClick={toggleChat}
        className={`${
          isOpen ? "hidden" : "flex"
        } bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 items-center justify-center shadow-lg transition-all`}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default ChatWidget;