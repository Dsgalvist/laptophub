"use client";

// This page shows the listings created by the logged in user

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getUserListings } from "@/lib/firebase/firestore";
import type { Listing } from "@/types/listing";
import ListingCard from "@/components/listings/ListingCard";

export default function DashboardListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userListings = await getUserListings(user.uid);
                setListings(userListings);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <p className="p-6">Loading your listings...</p>;
    }

    return (
        <main className="p-6">
            <h1 className="mb-6 text-2xl font-bold">My Listings</h1>

            {listings.length === 0 ? (
                <p>You have not created any listings yet.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {listings.map((listing) => (
                        <ListingCard key={listing.listingId} listing={listing} />
                    ))}
                </div>
            )}
        </main>
    );
}