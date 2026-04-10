"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { logoutUser } from "@/lib/firebase/auth";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="border-b border-gray-800 bg-[#0f172a] text-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="text-3xl font-bold tracking-tight text-white">
          LaptopHub
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium sm:gap-6">
          <Link href="/" className="transition hover:text-blue-400">
            Home
          </Link>

          <Link href="/listings" className="transition hover:text-blue-400">
            Listings
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="transition hover:text-blue-400">
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="transition hover:text-blue-400">
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}