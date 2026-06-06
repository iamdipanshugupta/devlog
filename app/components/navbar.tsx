import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "./logout-button";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b p-4 flex justify-between">
      <Link href="/">
        DevLog
      </Link>

      <div className="flex gap-4">
        <Link href="/explore">
          Explore
        </Link>

        {session ? (
          <>
            <Link href="/dashboard">
              Dashboard
            </Link>

            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">
              Login
            </Link>

            <Link href="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}