import { useState, useRef, useEffect } from 'react';

// --- SUB-COMPONENT: CHAT BUBBLE ---
const ChatBubble = ({ text, sender, timestamp }) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4 animate-in fade-in slide-in-from-bottom-2`}>
      <div
        className={`max-w-[80%] px-4 py-3 text-sm font-medium relative ${
          isUser
            ? 'bg-primary/10 border border-primary/30 text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm shadow-[0_0_15px_rgba(57,255,20,0.1)]'
            : 'glass-panel border-white/10 text-white/90 rounded-t-2xl rounded-br-2xl rounded-bl-sm bg-white/3'
        }`}
      >
        {/* Neon Glow for User */}
        {isUser && <div className="absolute inset-0 bg-primary/5 blur-md -z-10 rounded-2xl"></div>}

        <p className="leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>

      {/* Meta Data */}
      <span className="text-[9px] font-sm text-white mt-1 uppercase tracking-wider">
        {sender === 'ai' ? 'BIO SENTINEL' : 'USER'} • {timestamp}
      </span>
    </div>
  );
};

// --- MAIN COMPONENT: CHAT BOX ---
const ChatInterface = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial Mock Data
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "System initialized. BioSentinel AI online. Awaiting query regarding local biodiversity metrics.",
      sender: 'ai',
      timestamp: '09:41 AM'
    },
    {
      id: 2,
      text: "Hello, BioSentinel. Can you provide an update on the current status of the tiger population in Sector 7?",
      sender: 'user',
      timestamp: '09:42 AM'
    },
    {
      id: 3,
      text: "Accessing database... Panthera tigris populations are stable in Sector 7. Recent acoustic sensors detected movement near the river basin.",
      sender: 'ai',
      timestamp: '09:43 AM'
    },
    {
      id: 4,
      text: "WARNING: No critical threats detected in your immediate vicinity. Continue monitoring standard frequencies.",
      sender: 'ai',
      timestamp: '09:44 AM'
    },
    {
      id: 5,
      text: "Query received. Processing data... I do not have specific records on that subject in the local cache. Please refine your search parameters.",
      sender: 'ai',
      timestamp: '09:45 AM'
    }
  ]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const newUserMsg = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate AI Response Delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateMockResponse(input),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple mock logic for responses
  const generateMockResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('hello') || q.includes('hi')) return "Greetings, Operator. How can I assist with your ecological survey today?";
    if (q.includes('tiger') || q.includes('species')) return "Accessing database... Panthera tigris populations are stable in Sector 7. Recent acoustic sensors detected movement near the river basin.";
    if (q.includes('alert') || q.includes('danger')) return "WARNING: No critical threats detected in your immediate vicinity. Continue monitoring standard frequencies.";
    return "Query received. Processing data... I do not have specific records on that subject in the local cache. Please refine your search parameters.";
  };

  return (
    <div className="w-full max-w-md mx-auto h-150 flex flex-col glass-panel overflow-hidden border border-white/10 relative shadow-2xl bg-black/80 backdrop-blur-xl">

      {/* Header */}
      <div className="px-5 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary animate-ping opacity-75"></div>
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-[0.2em] uppercase leading-none mb-0.5">Bio Sentinel</h2>
          </div>
        </div>
        
        {/* Close Button using the prop */}
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-full border bg-red-500/20 border-red-500/50 text-red-500 transition-all duration-300"
          aria-label="Close Chat"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 scroll-smooth no-scrollbar relative">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            text={msg.text}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="glass-panel px-4 py-3 rounded-t-2xl rounded-br-2xl rounded-bl-sm border-white/5 bg-white/2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-white/30 mt-1 uppercase tracking-wider ml-1">PROCESSING...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/40 border-t border-white/10 z-10">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your query..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 rounded-lg text-primary hover:bg-primary/10 disabled:text-white/10 disabled:hover:bg-transparent transition-all"
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;