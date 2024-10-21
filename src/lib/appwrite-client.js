import { Storage, Client } from "appwrite";
export async function createClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  return {
    get storage() {
      return new Storage(client);
    },
  };
}

export async function getFilePreview(fileId) {
  try {
    const bucketID = process.env.NEXT_APPWRITE_BUCKET_ID;
    const { storage } = await createClient();
    return storage.getFilePreview(bucketID, fileId);
  } catch (error) {
    return null;
  }
}
