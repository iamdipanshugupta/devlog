"use client";

import { registerUser } from "@/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await registerUser(formData);

    if (result?.success === false) {
      toast.error(result.message || "Kuch galat ho gaya");
    } else {
      toast.success("Register ho gaye! Ab login karo");
      router.push("/login");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-1 text-white">Account banao</h1>
        <p className="text-slate-400 text-sm mb-6">DevLog pe likhna shuru karo</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Name</label>
            <input
              name="name"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              placeholder="Tumhara naam"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
            <input
              name="email"
              type="email"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Password</label>
            <input
              name="password"
              type="password"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              placeholder="strong password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-lg p-3 transition-colors mt-2"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-5 text-slate-500">
          Already account hai?{" "}
          <Link href="/login" className="text-sky-400 hover:underline">
            Login karo
          </Link>
        </p>
      </div>
    </div>
  );
}