"use server";
import { Resend } from "resend";
import IDCard from "./IDCardReady";
const resend = new Resend(process.env.NEXT_RESEND_KEY);

export default async function sendEmail(email) {
  const { data, error } = await resend.emails.send({
    from: "DevSoc <onboarding@resend.dev>",
    to: [email],
    subject: "Your ID Card is ready!",
    react: IDCard(),
  });
  if (error) return false;
  return true;
}
