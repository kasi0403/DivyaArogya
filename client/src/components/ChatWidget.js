import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize } from 'lucide-react';
import { HfInference } from "@huggingface/inference";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your medical assistant. Ask me about symptoms, treatments, or general health information.", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const client = new HfInference(process.env.HF_API_KEY);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendMessage = async () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = inputValue.trim();
    const newUserMessage = { id: messages.length + 1, text: userMessage, sender: "user" };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call the API with the user's query
      const response = await getMedicalInformation(userMessage);
      
      const botResponse = { 
        id: messages.length + 2, 
        text: response, 
        sender: "bot" 
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorResponse = { 
        id: messages.length + 2, 
        text: "I'm sorry, I couldn't process your request. Please try again later.", 
        sender: "bot" 
      };
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to call the API
  const getMedicalInformation = async (userQuery) => {
    try {
      const chatCompletion = await client.chatCompletion({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          {
            role: "system",
            content: "You are a helpful medical chatbot that provides general information about health topics, symptoms, and basic medical advice. Keep your answers informative but very brief. Always remind users to consult healthcare professionals for personalized medical advice."
          },
          {
            role: "user",
            content: userQuery
          }
        ],
        provider: "sambanova",
        max_tokens: 300,
      });
      
      return chatCompletion.choices[0].message.content;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
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
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">Health Assistant</h3>
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
                  {message.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-3 flex">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about health topics..."
              className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              className={`bg-blue-600 text-white px-3 py-2 rounded-r-lg transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              disabled={isLoading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

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

export default ChatWidget;
