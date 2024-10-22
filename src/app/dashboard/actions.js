"use server";
import { setVerifyStatus, markEmailAsVerify } from "../../lib/appwrite-server";
import sendEmail from "../../emails/sendEmail";
export async function markVerify(status, id) {
  return await setVerifyStatus(id, status);
}
export async function markEmail(email, id) {
  const sendingStatus = await sendEmail(email);
  if (sendingStatus) return markEmailAsVerify(id, true);
  return false;
}
