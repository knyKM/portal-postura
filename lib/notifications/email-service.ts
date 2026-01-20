import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

type EmailConfig = {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  from?: string;
};

function getEmailConfig(): EmailConfig {
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  return {
    host: process.env.SMTP_HOST,
    port: Number.isFinite(port) ? port : undefined,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  };
}

function isConfigValid(config: EmailConfig) {
  return Boolean(config.host && config.port && config.user && config.pass && config.from);
}

export async function sendEmail(payload: EmailPayload) {
  const config = getEmailConfig();
  if (!isConfigValid(config)) {
    return { ok: false, error: "SMTP não configurado." };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });

  return { ok: true };
}
