import { redirect } from "next/navigation";
import { getAttendees, getUser, isAdmin } from "../../lib/appwrite-server";
import Dashboard from "./dashboard";
import { cookies } from "next/headers";
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default async function Page({ searchParams }) {
  const session = cookies().get(process.env.NEXT_SESSION_COOKIE);
  if (!session) return redirect("/login");

  const user = await getUser();
  if (!user) return redirect("/login");

  const admin = await isAdmin(user.email);
  if (!admin) return redirect("/");

  const pageParam = searchParams?.page || "1";
  const currentPage = parseInt(pageParam);
  const filter = searchParams?.filter === "verified" ? true : false;
  const data = await getAttendees(currentPage, filter);

  // Calculate next and previous page numbers
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = data.length > 0 ? currentPage + 1 : null;

  return (
    <section>
      <Dashboard data={data} />
      <div className="flex justify-between px-24 py-8">
        {previousPage ? (
          <Link
            href={`?page=${previousPage}&filter=${
              filter ? "verified" : "unverified"
            }`}
          >
            <Button>Previous</Button>
          </Link>
        ) : (
          <Button disabled>Previous</Button>
        )}

        {nextPage ? (
          <Link
            href={`?page=${nextPage}&filter=${
              filter ? "verified" : "unverified"
            }`}
          >
            <Button>Next</Button>
          </Link>
        ) : (
          <Button disabled>Next</Button>
        )}
      </div>
    </section>
  );
}
