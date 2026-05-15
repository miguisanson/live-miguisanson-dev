import { render } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../context/auth-context";
import { DemoFeedbackProvider } from "../context/demo-feedback";
import { DemoDataProvider } from "../context/demo-data-context";
import { OpportunityModeProvider } from "../context/opportunity-mode";

export function renderApp(initialRoute: string): RenderResult {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <DemoFeedbackProvider>
          <DemoDataProvider>
            <OpportunityModeProvider>
              <App />
            </OpportunityModeProvider>
          </DemoDataProvider>
        </DemoFeedbackProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
