import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I\'m your MediGraph AI assistant. How can I help you with drug discovery today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('binding') && lowerQuery.includes('ace2')) {
      return "Based on our simulations, MediG-003 has a predicted binding affinity of -7.8 kcal/mol with ACE2. This suggests moderate binding potential.";
    }
    
    if (lowerQuery.includes('admet') || lowerQuery.includes('toxicity')) {
      return "The ADMET profile for our lead compounds shows promising results. MediG-001 has the highest score at 87.5, with good predicted oral bioavailability and low hepatotoxicity risk.";
    }
    
    if (lowerQuery.includes('compare') || lowerQuery.includes('difference')) {
      return "When comparing MediG-001 to FDA-Approved-Drug-001, we observe that the approved drug has better binding affinity (-11.0 vs -9.3 kcal/mol) and ADMET score (95.2 vs 87.5). However, MediG-001 shows novel structural features that may provide different selectivity profiles.";
    }
    
    if (lowerQuery.includes('mechanism') || lowerQuery.includes('action')) {
      return "MediG-001 is predicted to act as a competitive inhibitor of P53 Tumor Suppressor, potentially restoring normal function in cancer cells where P53 is mutated. The binding occurs at the DNA-binding domain.";
    }
    
    if (lowerQuery.includes('optimize') || lowerQuery.includes('improve')) {
      return "To optimize MediG-001, I recommend modifying the carboxylic acid group to improve membrane permeability. Adding a methyl group at position 4 might also enhance binding affinity based on our molecular dynamics simulations.";
    }
    
    return "I don't have specific information about that query. Would you like me to analyze any of our lead compounds for binding affinity, ADMET properties, or structural optimization opportunities?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chatbot">
      <div className="chatbot-header">
        <h3>MediGraph AI Assistant</h3>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'ai' ? 'ai-message' : 'user-message'}`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai-message typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about drug compounds, binding affinities, or optimization..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AIChatbot; 