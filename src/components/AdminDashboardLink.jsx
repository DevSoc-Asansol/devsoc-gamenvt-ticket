"use server";
import React from "react";
import { getUser, isAdmin } from "../lib/appwrite-server";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/dist/server/api-utils";

export default async function AdminDashboardLink() {
  const user = await getUser();
  if (!user) redirect("/login");
  const admin = await isAdmin(user.email);
  if (!admin) <></>;
  return (
    <Link
      className="rounded-full bg-black border border-solid border-white/[.1] transition-transform transform hover:scale-105 flex items-center justify-center hover:bg-[#f2f2f2] hover:text-[#000] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 hover:shadow-lg"
      href="/dashboard"
      rel="noopener noreferrer"
    >
      Admin Dashboard
    </Link>
  );
}
