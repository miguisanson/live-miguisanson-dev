import { X, Send } from "lucide-react";

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotPanel({ isOpen, onClose }: ChatbotPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-[#E2E8F0] z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] bg-[#003DA5] rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-sm font-semibold text-white">PG Next AI Assistant</span>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:bg-white/10 rounded p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-[#64748B] mb-4">
          Ask me anything about your brand data, competitors, or trends.
        </p>

        {/* Suggested Questions */}
        <div className="mb-4">
          <div className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
            Suggested:
          </div>
          <div className="space-y-2">
            <button className="w-full text-left text-xs text-[#003DA5] hover:bg-[#E8F0FC] p-2 rounded transition-colors">
              ● "Why is Downy flagged?"
            </button>
            <button className="w-full text-left text-xs text-[#003DA5] hover:bg-[#E8F0FC] p-2 rounded transition-colors">
              ● "Compare Ariel vs Surf last month"
            </button>
            <button className="w-full text-left text-xs text-[#003DA5] hover:bg-[#E8F0FC] p-2 rounded transition-colors">
              ● "Show me all scent complaints"
            </button>
          </div>
        </div>

        {/* Context Chips */}
        <div className="mb-3">
          <button className="text-xs px-2 py-1 bg-[#E8F0FC] text-[#003DA5] rounded border border-[#C7D9F8] hover:bg-[#003DA5] hover:text-white transition-colors">
            + Add context: Ariel Brand
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E2E8F0] my-3"></div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 bg-[#F4F6FA] border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003DA5]"
          />
          <button className="px-4 py-2 bg-[#003DA5] text-white rounded-lg hover:bg-[#0057C8] transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
