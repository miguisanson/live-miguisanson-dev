import nodemailer from "nodemailer";
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

function hasCompleteSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function hasTransactionalEmailProvider() {
  return Boolean(process.env.RESEND_API_KEY || hasCompleteSmtpConfig());
}

function getFromAddress() {
  const from = process.env.AUTH_EMAIL_FROM?.trim();
  if (!from) {
    console.error("[auth email] AUTH_EMAIL_FROM is missing. Transactional email was not sent.");
    return undefined;
  }
  return from;
}

function getSmtpTransport() {
  const host = process.env.SMTP_HOST?.trim();
  const portValue = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;

  if (!host && !portValue && !user && !pass) {
    return undefined;
  }

  if (!host || !portValue || !user || !pass) {
    console.error("[auth email] SMTP is partially configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.");
    return undefined;
  }

  const port = Number(portValue);
  if (!Number.isInteger(port) || port <= 0) {
    console.error(`[auth email] SMTP_PORT must be a positive integer. Received "${portValue}".`);
    return undefined;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendTransactionalEmail(message: TransactionalEmail) {
  const from = getFromAddress();
  if (!from) {
    return;
  }

  const resend = getResend();
  if (resend) {
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
    return;
  }

  const smtp = getSmtpTransport();
  if (smtp) {
    try {
      await smtp.sendMail({
        from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
    } catch (error) {
      console.error(
        `[auth email] SMTP send failed for ${message.to}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`[auth email] ${message.subject} for ${message.to}`);
    if (message.developmentUrl) {
      console.log(`[auth email] Open this local link: ${message.developmentUrl}`);
    }
  } else {
    console.error("[auth email] No email provider configured. Set RESEND_API_KEY or SMTP_* variables.");
  }
}
