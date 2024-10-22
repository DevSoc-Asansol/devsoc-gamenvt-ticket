"use server";
import { Query } from "node-appwrite";
import { createSessionClient, getUser } from "../../lib/appwrite-server";
import IdCard from "./idCard";
import RegistrationConfirmation from "../registration/registered";
export default async function Page() {
  const { db } = await createSessionClient();
  const user = await getUser();
  if (!user) return redirect("/login");
  const id = user.$id;
  const isVerifiedQuery = [
    Query.equal("authId", id),
    Query.equal("isVerified", true),
  ];
  const isVerified = await db.listDocuments(
    process.env.NEXT_PUBLIC_DB_ID,
    process.env.NEXT_PUBLIC_APPWRITE_ATTENDEES_COLLECTION,
    isVerifiedQuery
  );
  if (isVerified.documents.length >= 1)
    return (
      <IdCard
        name={isVerified.documents[0].name}
        year={isVerified.documents[0].year}
      />
    );
  return <RegistrationConfirmation />;
}
