import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { OpportunityModeProvider } from "./context/opportunity-mode";
import { AuthProvider } from "./context/auth-context";
import { DemoFeedbackProvider } from "./context/demo-feedback";
import { DemoDataProvider } from "./context/demo-data-context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DemoFeedbackProvider>
          <DemoDataProvider>
            <OpportunityModeProvider>
              <App />
            </OpportunityModeProvider>
          </DemoDataProvider>
        </DemoFeedbackProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
