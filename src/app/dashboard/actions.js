"use server";
import { setVerifyStatus } from "../../lib/appwrite-server";
export async function markVerify(status, id) {
  return await setVerifyStatus(id, status);
}
