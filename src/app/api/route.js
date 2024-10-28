import { NextResponse } from "next/server";
import { createAdminClient } from "../../lib/appwrite-server";

export async function GET() {
  const { db } = await createAdminClient();
  const docs = await db.listDocuments(
    process.env.NEXT_PUBLIC_DB_ID,
    process.env.NEXT_PUBLIC_APPWRITE_ATTENDEES_COLLECTION
  );
  return NextResponse.json({ docs: docs });
}
