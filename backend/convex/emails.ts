import { action } from "./_generated/server";
import { Resend } from "resend";
import { v } from "convex/values";

const resend = new Resend(process.env.RESEND_API_KEY!);
const siteUrl = process.env.SITE_URL!;

export const sendVerificationEmail = action({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (_, { email, code }) => {
    const verificationUrl = `${siteUrl}/verify-email?code=${code}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email to login to PitchForge",
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
    });
  },
});
