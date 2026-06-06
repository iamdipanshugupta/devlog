import { auth, signOut } from "@/auth";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import NextAuthProvider from "./components/session-provider";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userName = session?.user?.name;

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <NextAuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                color: "#f1f5f9",
                border: "1px solid #334155",
              },
            }}
          />

          <nav className="sticky top-0 z-20 border-b border-slate-700/60 bg-slate-950/85 px-6 py-4 backdrop-blur-xl shadow-sm">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="font-bold text-xl text-white hover:text-sky-400 transition-colors"
              >
                DevLog
              </Link>
              <Link
                href="/explore"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Explore
              </Link>

              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/posts/new"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    New Post
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                    className="ml-auto"
                  >
                    <button
                      type="submit"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Logout ({userName})
                    </button>
                  </form>
                </>
              ) : (
                <div className="ml-auto flex gap-3">
                  <Link
                    href="/login"
                    className="rounded-full border border-slate-600 px-4 py-1.5 text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-400 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <main className="max-w-6xl mx-auto p-6">{children}</main>

          <footer className="border-t border-slate-700/60 mt-16 py-8 text-center text-slate-500 text-sm">
            <p>© 2026 DevLog — Built with Next.js, Prisma & Neon</p>
          </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
