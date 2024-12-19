import sgMail from "@sendgrid/mail"

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY is not defined")
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = async (to: string, subject: string, html: string) => {
  const msg = {
    to,
    from: { email: "admin@tdss.site", name: "TDSS" }, // Verified sender
    subject,
    html,
  }

  await sgMail.send(msg)
}
