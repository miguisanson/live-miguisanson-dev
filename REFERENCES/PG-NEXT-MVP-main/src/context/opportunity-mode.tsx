import * as React from "react";

interface OpportunityModeContextShape {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
}

const OpportunityModeContext = React.createContext<OpportunityModeContextShape | null>(
  null,
);

const OPPORTUNITY_MODE_STORAGE_KEY = "consumer_iq_opportunity_mode_v1";

function readStoredOpportunityMode(): boolean {
  try {
    const raw = localStorage.getItem(OPPORTUNITY_MODE_STORAGE_KEY);
    if (!raw) {
      return false;
    }
    const parsed = JSON.parse(raw) as { enabled: boolean };
    return parsed.enabled;
  } catch {
    return false;
  }
}

export function OpportunityModeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [enabled, setEnabled] = React.useState<boolean>(() => readStoredOpportunityMode());

  React.useEffect(() => {
    localStorage.setItem(
      OPPORTUNITY_MODE_STORAGE_KEY,
      JSON.stringify({ enabled }),
    );
  }, [enabled]);

  return (
    <OpportunityModeContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </OpportunityModeContext.Provider>
  );
}

export function useOpportunityMode(): OpportunityModeContextShape {
  const context = React.useContext(OpportunityModeContext);
  if (!context) {
    throw new Error("useOpportunityMode must be used inside OpportunityModeProvider");
  }
  return context;
}
