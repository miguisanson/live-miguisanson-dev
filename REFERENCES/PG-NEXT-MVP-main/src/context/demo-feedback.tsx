import * as React from "react";

interface ToastMessage {
  id: string;
  title: string;
  detail?: string;
}

interface FeedbackContextShape {
  notify: (title: string, detail?: string) => void;
}

const FeedbackContext = React.createContext<FeedbackContextShape | null>(null);

export function DemoFeedbackProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [messages, setMessages] = React.useState<ToastMessage[]>([]);

  const notify = React.useCallback((title: string, detail?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setMessages((prev) => [...prev, { id, title, detail }]);
    window.setTimeout(() => {
      setMessages((prev) => prev.filter((message) => message.id !== id));
    }, 2800);
  }, []);

  return (
    <FeedbackContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className="rounded-lg border border-[rgba(0,158,223,0.3)] bg-white p-3 shadow-lg"
          >
            <p className="text-sm font-semibold text-slate-900">{message.title}</p>
            {message.detail ? (
              <p className="mt-1 text-xs text-slate-600">{message.detail}</p>
            ) : null}
          </div>
        ))}
      </div>
    </FeedbackContext.Provider>
  );
}

export function useDemoFeedback(): FeedbackContextShape {
  const context = React.useContext(FeedbackContext);
  if (!context) {
    throw new Error("useDemoFeedback must be used inside DemoFeedbackProvider");
  }
  return context;
}
