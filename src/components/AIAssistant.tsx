import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantProps {
  context?: 'drug-design' | 'graph-discovery' | 'general';
}

const AIAssistant: React.FC<AIAssistantProps> = ({ context = 'general' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial greeting message
  useEffect(() => {
    const greeting = getContextGreeting(context);
    setMessages([
      {
        id: 'greeting',
        text: greeting,
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, [context]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getContextGreeting = (context: string): string => {
    switch (context) {
      case 'drug-design':
        return "Hello! I'm your AI assistant for drug design. I can help you analyze molecules, suggest modifications, and explain drug properties. What would you like to know?";
      case 'graph-discovery':
        return "Welcome to Graph Discovery! I can help you explore relationships between drugs, targets, and diseases. What would you like to investigate?";
      default:
        return "Hi there! I'm your MediGraph AI assistant. How can I help you today?";
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate AI response based on context
    setTimeout(() => {
      const aiResponse = generateResponse(inputText, context);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const generateResponse = (query: string, context: string): string => {
    // Simple response generation based on keywords and context
    const lowerQuery = query.toLowerCase();
    
    if (context === 'drug-design') {
      if (lowerQuery.includes('lipinski') || lowerQuery.includes('rule of five')) {
        return "Lipinski's Rule of Five states that drug-like molecules generally have: molecular weight ≤500, LogP ≤5, hydrogen bond donors ≤5, and hydrogen bond acceptors ≤10. These properties help predict oral bioavailability.";
      } else if (lowerQuery.includes('docking') || lowerQuery.includes('binding')) {
        return "Molecular docking predicts the preferred orientation of a molecule when bound to a target protein. Lower binding energies (more negative values) generally indicate stronger binding. Values below -8 kcal/mol typically suggest good binding affinity.";
      } else if (lowerQuery.includes('optimize') || lowerQuery.includes('improve')) {
        return "To optimize a molecule, consider: adding H-bond donors/acceptors to improve target interactions, modifying solubility with polar groups, reducing rotatable bonds for better binding entropy, or adding lipophilic groups to increase membrane permeability.";
      }
    } else if (context === 'graph-discovery') {
      if (lowerQuery.includes('pathway') || lowerQuery.includes('mechanism')) {
        return "Drug-target-disease pathways show how drugs affect biological systems. For example, statins inhibit HMG-CoA reductase, reducing cholesterol synthesis and lowering cardiovascular disease risk. Graph analysis can reveal these complex relationships.";
      } else if (lowerQuery.includes('repurpose') || lowerQuery.includes('reposition')) {
        return "Drug repurposing identifies new uses for existing drugs. Graph analysis helps by finding unexpected connections between drugs and diseases through shared targets or pathways. This approach is faster and less expensive than traditional drug discovery.";
      }
    }
    
    // Generic responses
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi ')) {
      return "Hello! How can I assist you today?";
    } else if (lowerQuery.includes('thank')) {
      return "You're welcome! Let me know if you have any other questions.";
    } else if (lowerQuery.includes('how') && lowerQuery.includes('work')) {
      return "I analyze patterns in biomedical data to provide insights about drugs, targets, and diseases. I can help with molecular analysis, property prediction, and relationship discovery.";
    }
    
    return "That's an interesting question. While I don't have a specific answer, I can help you analyze molecular properties, explore drug-target relationships, or explain pharmacological concepts. Could you provide more details about what you're looking for?";
  };

  return (
    <div className="ai-assistant">
      <div className="assistant-header">
        <h3>AI Assistant</h3>
        <span className="context-badge">{context}</span>
      </div>
      
      <div className="messages-container">
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
      
      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          placeholder="Ask a question..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping || !inputText.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AIAssistant; 