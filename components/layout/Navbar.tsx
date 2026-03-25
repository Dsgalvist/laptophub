"use client";

// This component displays the main navigation bar
// It helps users move between the main pages of the app

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
        // Listen for authentication changes
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
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-3xl font-bold tracking-tight text-white">
                    LaptopHub
                </Link>

                <div className="flex items-center gap-6 text-sm font-medium">
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