"use server";

import { revalidatePath } from "next/cache";
import { getUser, registerAttendee, upload } from "../../lib/appwrite-server";
import { getFilePreview } from "../../lib/appwrite-client";
export async function registerStudent(prevState, formData) {
  // Simulate a delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Process the form data
  const name = formData.get("name");
  const department = formData.get("department");
  const year = formData.get("year");
  const whatsappNumber = formData.get("whatsappNumber");
  const hasLaptop = formData.get("hasLaptop");
  const heardOfEngines = formData.get("heardOfEngines");
  const paymentScreenshot = formData.get("paymentScreenshot");
  const upiTransactionId = formData.get("upiTransactionId");

  // Check if all required fields are filled
  if (
    !name ||
    !department ||
    !year ||
    !whatsappNumber ||
    !hasLaptop ||
    !heardOfEngines ||
    !upiTransactionId
  ) {
    return { success: false, message: "Please fill all required fields." };
  }

  // Check if WhatsApp number is valid
  if (!/^\d{10}$/.test(whatsappNumber)) {
    return {
      success: false,
      message: "Please enter a valid 10-digit WhatsApp number.",
    };
  }

  // Check if payment screenshot is uploaded
  if (!paymentScreenshot) {
    return { success: false, message: "Please upload the payment screenshot." };
  }

  const url = await upload(paymentScreenshot);
  if (!url)
    return {
      success: false,
      message: "Some error occured while uploading screenshot! Contact admins",
    };
  // If everything is valid, return success
  // revalidatePath('/')
  const user = await getUser();
  const data = Object.fromEntries(formData);
  const newData = {};
  newData["hasLaptop"] = data["hasLaptop"] === "no" ? false : true;
  newData["heardOfEngines"] = data["heardOfEngines"] === "no" ? false : true;
  newData["email"] = user.email;
  newData["authId"] = user.$id
  newData["paymentScreenshot"] = url
  newData["name"] = name;
  newData["department"] = department;
  newData["year"] = year;
  newData["whatsappNumber"] = whatsappNumber;
  newData["upiTransactionId"] = upiTransactionId;
  const result = await registerAttendee(newData);
  const { id, success } = result;
  revalidatePath("/registration");
  return {
    success,
    message: success ? "Registration successful!" : "Please register again",
  };
}
