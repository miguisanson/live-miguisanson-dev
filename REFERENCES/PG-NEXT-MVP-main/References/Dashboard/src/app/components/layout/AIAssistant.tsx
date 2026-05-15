import { useState } from "react";
import { MessageSquare, X, Send, Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

const quickActions = [
  { icon: Lightbulb, label: "Get Insights", color: "bg-[#F59E0B]" },
  { icon: TrendingUp, label: "Show Trends", color: "bg-[#10B981]" },
  { icon: AlertCircle, label: "Identify Issues", color: "bg-[#EF4444]" },
];

const suggestedPrompts = [
  "Why is Downy's rating declining this week?",
  "Compare Ariel vs Surf performance last month",
  "Show me all scent-related complaints",
  "What are the top 3 emerging consumer needs?",
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{type: 'user' | 'assistant', text: string}>>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { type: 'user', text: inputValue }]);
      setInputValue("");
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'assistant', 
          text: "I'm analyzing the data. This is a simulated response for demonstration purposes." 
        }]);
      }, 1000);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#003DA5] text-white rounded-full shadow-lg hover:bg-[#0057C8] transition-all duration-300 ${
          isOpen ? "scale-95" : "scale-100 hover:scale-105"
        }`}
        style={{ marginLeft: "64px" }}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="font-medium text-sm">AI Assistant</span>
      </button>

      {/* Chatbot Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[400px] bg-white rounded-xl shadow-2xl border border-[#E2E8F0]" style={{ marginLeft: "64px" }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] bg-[#003DA5] rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">P&G Consumer IQ Assistant</div>
                <div className="text-xs text-white/70">AI-powered insights</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 rounded p-1.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              Quick Actions
            </div>
            <div className="flex gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="flex-1 flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-[#E2E8F0] hover:border-[#003DA5] hover:shadow-sm transition-all group"
                >
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-[#1A1A2E] text-center leading-tight">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[280px] overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-[#64748B] mb-4">
                  Ask me anything about your data, or try one of these:
                </p>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputValue(prompt)}
                      className="w-full text-left text-xs text-[#003DA5] bg-[#E8F0FC] hover:bg-[#D1E4FC] p-3 rounded-lg transition-colors border border-[#C7D9F8]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-lg text-sm ${
                        msg.type === 'user'
                          ? 'bg-[#003DA5] text-white'
                          : 'bg-[#F1F5F9] text-[#1A1A2E]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#E2E8F0]">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2.5 bg-[#F4F6FA] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003DA5] focus:bg-white"
              />
              <button 
                onClick={handleSend}
                className="px-4 py-2.5 bg-[#003DA5] text-white rounded-lg hover:bg-[#0057C8] transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
