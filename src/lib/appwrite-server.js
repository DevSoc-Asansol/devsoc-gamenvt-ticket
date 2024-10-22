"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Client,
  Account,
  OAuthProvider,
  Databases,
  Storage,
  ID,
  Query,
} from "node-appwrite";
import { getFilePreview } from "./appwrite-client";
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const session = cookies().get(process.env.NEXT_SESSION_COOKIE);
  if (!session || !session.value) {
    return redirect("/login");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get db() {
      return new Databases(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
    .setKey(process.env.NEXT_APPWRITE_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get db() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

export async function signUpWithGoogle() {
  const { account } = await createAdminClient();

  const origin = headers().get("origin");
  const successURL = `${origin}/oauth`;
  const failureURL = `${origin}/login`;
  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    successURL,
    failureURL
  );
  return redirect(redirectUrl);
}

export async function signOut() {
  const { account } = await createSessionClient();
  await account.deleteSessions();
  cookies().delete(process.env.NEXT_SESSION_COOKIE);
}

export async function getUser() {
  const { account } = await createSessionClient();
  const user = await account.get();
  return user;
}

export async function createAttendeeSchema() {
  const { db } = await createAdminClient();
  const DB = process.env.NEXT_PUBLIC_DB_ID;
  const COL = process.env.NEXT_PUBLIC_APPWRITE_ATTENDEES_COLLECTION;
  const DEFAULT_SIZE = 400;
  try {
    await Promise.allSettled([
      db.createStringAttribute(DB, COL, "name", DEFAULT_SIZE, true),
      db.createStringAttribute(DB, COL, "department", DEFAULT_SIZE, true),
      db.createStringAttribute(DB, COL, "year", 30, true),
      db.createStringAttribute(DB, COL, "whatsappNumber", 15, true),
      db.createBooleanAttribute(DB, COL, "hasLaptop", true),
      db.createBooleanAttribute(DB, COL, "heardOfEngines", true),
      db.createStringAttribute(DB, COL, "paymentScreenshot", 4000, true),
      db.createStringAttribute(DB, COL, "upiTransactionId", DEFAULT_SIZE, true),
      db.createBooleanAttribute(DB, COL, "isVerified", false, false),
      db.createStringAttribute(DB, COL, "email", DEFAULT_SIZE, true),
      db.createStringAttribute(DB, COL, "authId", DEFAULT_SIZE, true),
    ])
      .then((results) => {
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            console.log(`Attribute ${index + 1} created successfully.`);
          } else {
            console.error(
              `Error creating attribute ${index + 1}:`,
              result.reason
            );
          }
        });
      })
      .catch((error) => {
        console.error("Error during attribute creation:", error);
      });
  } catch (error) {
    console.error("Error while creating attributes of attendee -", error);
  }
}

export async function registerAttendee(data) {
  try {
    const { db } = await createSessionClient();
    console.log("loading");
    const result = await db.createDocument(
      process.env.NEXT_PUBLIC_DB_ID,
      process.env.NEXT_PUBLIC_APPWRITE_ATTENDEES_COLLECTION,
      ID.unique(),
      data
    );
    return { success: true, id: result.$id };
  } catch (error) {
    console.log({ error });
    return { success: false, id: "" };
  }
}

export async function upload(file) {
  try {
    const bucketID = process.env.NEXT_APPWRITE_BUCKET_ID;
    const { storage } = await createAdminClient();
    const createdFile = await storage.createFile(bucketID, ID.unique(), file);
    const fileId = createdFile.$id;
    const fileURL = await getFilePreview(fileId);
    if (!fileURL) throw Error("File upload url not came ");
    return fileURL;
  } catch (error) {
    console.error("File upload error ", error);
    return null;
  }
}

export async function isAdmin(email) {
  const DB = process.env.NEXT_PUBLIC_DB_ID;
  const COL = process.env.NEXT_PUBLIC_APPWRITE_ADMIN_COLLECTION;
  const { db } = await createSessionClient();
  const query = [Query.equal("email", email)];
  const admin = await db.listDocuments(DB, COL, query);
  if (admin.documents?.length) {
    return true;
  }

  return false;
}

export async function getAttendees(page, filter) {
  const DB = process.env.NEXT_PUBLIC_DB_ID;
  const COL = process.env.NEXT_PUBLIC_APPWRITE_ATTENDEES_COLLECTION;
  const { db } = await createSessionClient();
  const query = [
    Query.equal("isVerified", filter),
    Query.limit(30),
    Query.offset((page - 1) * 30),
  ];
  const docs = await db.listDocuments(DB, COL, query);
  return docs.documents;
}

export async function setVerifyStatus(id, status) {
  try {
    const DB = process.env.NEXT_PUBLIC_DB_ID;
    const COL = process.env.NEXT_PUBLIC_APPWRITE_ATTENDEES_COLLECTION;
    const { db } = await createSessionClient();
    await db.updateDocument(DB, COL, id, { isVerified: status });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function markEmailAsVerify(id, status) {
  try {
    const DB = process.env.NEXT_PUBLIC_DB_ID;
    const COL = process.env.NEXT_PUBLIC_APPWRITE_ATTENDEES_COLLECTION;
    const { db } = await createSessionClient();
    await db.updateDocument(DB, COL, id, { isEmailSent: status });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function checkSeatAvailability() {
  const DB = process.env.NEXT_PUBLIC_DB_ID;
  const ATTENDEES_COL = process.env.NEXT_PUBLIC_APPWRITE_ATTENDEES_COLLECTION;
  const SEATS_COL = process.env.NEXT_SEAT_KEY;

  const { db } = await createSessionClient();

  // Get the total number of registered attendees
  const attendeesData = await db.listDocuments(DB, ATTENDEES_COL);
  const totalRegistered = attendeesData.total;

  // Get the total number of available seats
  const seatsData = await db.listDocuments(DB, SEATS_COL, [Query.limit(1)]);
  const seatsDoc = seatsData.documents[0];
  const totalSeatsAvailable = seatsDoc.seat + seatsDoc.reserved;

  // Check if there are enough seats available
  return {
    available: totalSeatsAvailable > totalRegistered,
    left: totalSeatsAvailable - totalRegistered,
  };
}
