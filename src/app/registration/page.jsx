"use server";
import { Query } from "node-appwrite";
import { createSessionClient, getUser } from "../../lib/appwrite-server";
import RegistrationForm from "./auth-form";
import RegistrationConfirmation from "./registered"
export default async function Page() {
  const { db } = await createSessionClient();
  const user = await getUser();
  const id = user.$id;
  const isRegisteredQuery = [Query.equal("authId", id)];
  const isRegistered = await db.listDocuments(
    process.env.NEXT_PUBLIC_DB_ID,
    process.env.NEXT_PUBLIC_APPWRITE_ATTENDEES_COLLECTION,
    isRegisteredQuery
  );
  console.log({isRegistered:isRegistered.documents})
  if (isRegistered.documents.length >= 1) return <RegistrationConfirmation/>;
  return <RegistrationForm />;
}
