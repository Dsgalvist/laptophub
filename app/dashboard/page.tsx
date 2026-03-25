"use client";

// This page is the main dashboard for the logged in user
// It redirects to login if there is no authenticated user

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";

export default function DashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if a user is logged in
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login");
                return;
            }

            setUserName(user.displayName || user.email || "User");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <p className="p-6">Loading dashboard...</p>;
    }

    return (
        <main className="mx-auto max-w-5xl p-6">
            <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
            <p className="mb-8 text-gray-600">Welcome, {userName}</p>

            <div className="grid gap-4 md:grid-cols-3">
                <Link
                    href="/dashboard/new-listing"
                    className="rounded-lg border p-6 shadow-sm transition hover:shadow-md"
                >
                    <h2 className="mb-2 text-xl font-semibold">Add New Listing</h2>
                    <p className="text-sm text-gray-600">
                        Create a new laptop listing and upload its details.
                    </p>
                </Link>

                <Link
                    href="/dashboard/listings"
                    className="rounded-lg border p-6 shadow-sm transition hover:shadow-md"
                >
                    <h2 className="mb-2 text-xl font-semibold">My Listings</h2>
                    <p className="text-sm text-gray-600">
                        View and manage the listings you created.
                    </p>
                </Link>

                <Link
                    href="/dashboard/favorites"
                    className="rounded-lg border p-6 shadow-sm transition hover:shadow-md"
                >
                    <h2 className="mb-2 text-xl font-semibold">My Favorites</h2>
                    <p className="text-sm text-gray-600">
                        See the listings you saved as favorites.
                    </p>
                </Link>
            </div>
        </main>
    );
}