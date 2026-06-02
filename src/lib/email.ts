import { Resend } from "resend";

type TransactionalEmail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  developmentUrl?: string;
};

function getResend() {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : undefined;
}

export async function sendTransactionalEmail(message: TransactionalEmail) {
  const resend = getResend();
  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[auth email] ${message.subject} for ${message.to}`);
      if (message.developmentUrl) {
        console.log(`[auth email] Open this local link: ${message.developmentUrl}`);
      }
    } else {
      console.error("[auth email] RESEND_API_KEY is missing. Transactional email was not sent.");
    }
    return;
  }

  const from = process.env.AUTH_EMAIL_FROM;
  if (!from) {
    console.error("[auth email] AUTH_EMAIL_FROM is missing. Transactional email was not sent.");
    return;
  }

  const { error } = await resend.emails.send({
    from,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });

  if (error) {
    console.error(`[auth email] Resend rejected "${message.subject}" for ${message.to}: ${error.message}`);
  }
}
