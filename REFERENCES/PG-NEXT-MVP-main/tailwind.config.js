import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--fg)",
        card: "var(--card)",
        border: "var(--border)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-fg)",
        primary: "var(--primary)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(70, 84, 103, 0.2), 0 8px 24px rgba(0, 0, 0, 0.28)",
      },
    },
  },
  plugins: [forms, typography],
};
