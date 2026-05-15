import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SESSION_STORAGE_KEY } from "../data/mock-users";
import { renderApp } from "./test-utils";

function seedSession(email: string): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ email }));
}

describe("Consumer IQ prototype interactions", () => {
  test("login and logout flow works", async () => {
    const user = userEvent.setup();
    renderApp("/login");

    await user.click(screen.getByRole("button", { name: /Operations Manager/i }));
    await screen.findByRole("heading", { name: /Operations Dashboard/i });

    await user.click(screen.getByRole("button", { name: /Logout/i }));
    await screen.findByRole("button", { name: /Sign in/i });
  });

  test("role-based route guard redirects restricted role away from operations", async () => {
    seedSession("market.ops@consumeriq.local");
    renderApp("/operations");

    await screen.findByRole("heading", { name: /Brand Overview Dashboard/i });
    expect(screen.queryByRole("link", { name: /Operations Dashboard/i })).not.toBeInTheDocument();
  });

  test("opportunity mode switch reveals future sections", async () => {
    const user = userEvent.setup();
    seedSession("operations.manager@consumeriq.local");
    renderApp("/opportunities");

    expect(screen.getByText(/Opportunity Mode is OFF/i)).toBeInTheDocument();

    const switches = screen.getAllByRole("switch");
    await user.click(switches[0]);

    await screen.findByText(/Long-horizon concepts for trust and decision-safety evolution/i);
  });

  test("quick insight modal opens and regenerates", async () => {
    const user = userEvent.setup();
    seedSession("market.ops@consumeriq.local");
    renderApp("/brand-overview");

    await user.click(screen.getAllByTestId("quick-insight-trigger")[0]);
    await screen.findByTestId("quick-insight-modal");

    await user.click(screen.getByTestId("quick-insight-regenerate"));
    await screen.findByText(/Last Generated Insight/i);

    await user.click(screen.getByRole("button", { name: /^Close$/i }));
    expect(screen.queryByTestId("quick-insight-modal")).not.toBeInTheDocument();
  });

  test("manual handoff ticket can be created from incident queue", async () => {
    const user = userEvent.setup();
    seedSession("operations.manager@consumeriq.local");
    renderApp("/incidents");

    const before = screen.getAllByText(/Not created/i).length;
    const notCreatedBadges = screen.getAllByText(/Not created/i);
    const targetRow = notCreatedBadges[0].closest("tr");
    if (!targetRow) {
      throw new Error("Expected a row with 'Not created' handoff state.");
    }
    await user.click(within(targetRow).getByRole("button", { name: /Escalate/i }));
    await screen.findByText(/Manual handoff ticket/i);

    expect(screen.queryAllByText(/Not created/i).length).toBeLessThan(before);
  });

  test("self-healing threshold escalation creates manual handoff when breach persists", async () => {
    const user = userEvent.setup();
    seedSession("operations.manager@consumeriq.local");
    renderApp("/operations");

    await user.click(screen.getAllByRole("button", { name: /Run Self-Healing/i })[0]);
    await screen.findByText(/Threshold breached\. Manual ticket INC-0001 created\./i);
  });

  test("alerts can be acknowledged", async () => {
    const user = userEvent.setup();
    seedSession("operations.manager@consumeriq.local");
    renderApp("/alerts");

    await user.click(screen.getAllByRole("button", { name: /Acknowledge/i })[0]);
    await screen.findByText(/Ack @/i);
  });

  test("pipeline rerun action is interactive", async () => {
    const user = userEvent.setup();
    seedSession("operations.manager@consumeriq.local");
    renderApp("/operations");

    await user.click(screen.getByRole("button", { name: /Rerun/i }));
    await screen.findByText(/Pipeline rerun triggered/i);
  });

  test("operations chart container renders", async () => {
    seedSession("operations.manager@consumeriq.local");
    renderApp("/operations");
    expect(await screen.findByTestId("latency-chart")).toBeInTheDocument();
  });

  test("help icon opens contextual help popover", async () => {
    const user = userEvent.setup();
    seedSession("operations.manager@consumeriq.local");
    renderApp("/overview");

    const helpButton = screen.getByRole("button", { name: /Help: Global search/i });
    await user.hover(helpButton);

    expect(
      await screen.findByText(/Search in this prototype helps you quickly navigate concepts and labels/i),
    ).toBeInTheDocument();
  });

  test("monitoring settings can add a rule and persist threshold updates", async () => {
    const user = userEvent.setup();
    seedSession("operations.manager@consumeriq.local");
    renderApp("/settings/monitoring");

    const thresholdTable = screen.getByRole("table");
    const valueInput = within(thresholdTable).getAllByRole("spinbutton")[0];
    await user.clear(valueInput);
    await user.type(valueInput, "3");
    await user.click(screen.getByRole("button", { name: /Save Threshold Changes/i }));
    await screen.findByText(/Threshold settings saved/i);

    await user.click(screen.getByRole("button", { name: /Add Monitoring Rule/i }));
    await user.type(screen.getByLabelText("Rule name"), "Validation anomaly spike");
    await user.type(screen.getByLabelText("Metric"), "Validation pass rate");
    await user.type(screen.getByLabelText("Threshold"), "< 96%");
    await user.click(screen.getByRole("button", { name: /Create rule/i }));
    await screen.findByText(/Monitoring rule created/i);
  });
});
