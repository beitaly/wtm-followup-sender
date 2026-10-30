// WTM 2026 — Automated follow-up email sender
// Fires on: Tuesday 10 November 2026 at 09:00 Europe/Lisbon
// Deploy on Railway — set env vars below

const nodemailer = require("nodemailer");
const cron = require("node-cron");
const emails = require("./emails");

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const SEND_DATE = "2026-11-10";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD,
    },
});

async function sendAll() {
    console.log(`[${new Date().toISOString()}] Starting WTM follow-up send — ${emails.length} emails`);

  for (const email of emails) {
        try {
                await transporter.sendMail({
                          from: `"Concezio Natale | Best Holidays in Italy" <${GMAIL_USER}>`,
                          to: email.to,
                          subject: email.subject,
                          text: email.body + "\n\n--\nBest Holidays in Italy\nwww.bestholidaysinitaly.com\n+353 1 2544280",
                });
                console.log(`Sent to ${email.name} <${email.to}>`);
        } catch (err) {
                console.error(`Failed to send to ${email.to}: ${err.message}`);
        }
        await new Promise((r) => setTimeout(r, 3000));
  }

  console.log(`[${new Date().toISOString()}] All done.`);
}

cron.schedule("0 9 10 11 *", () => {
    const today = new Date().toISOString().slice(0, 10);
    if (today === SEND_DATE) {
          sendAll();
    } else {
          console.log(`[${new Date().toISOString()}] Scheduled check — not send day yet (today: ${today}, target: ${SEND_DATE})`);
    }
}, {
    timezone: "Europe/Lisbon",
});

console.log(`[${new Date().toISOString()}] WTM follow-up scheduler running. Will fire at 09:00 Lisbon on ${SEND_DATE}.`);

setInterval(() => {}, 1000 * 60 * 60);
