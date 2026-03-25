"use client";

// This page displays all listings in the app
// It gets listing data from Firestore and shows each item using ListingCard

import { useEffect, useState } from "react";
import { getListings } from "@/lib/firebase/firestore";
import type { Listing } from "@/types/listing";
import ListingCard from "@/components/listings/ListingCard";

export default function ListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Get all listings from Firestore
                const data = await getListings();
                setListings(data);
            } catch (error) {
                console.error("Error loading listings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    if (loading) {
        return <p className="p-6">Loading listings...</p>;
    }

    return (
        <main className="p-6">
            <h1 className="mb-6 text-2xl font-bold">All Listings</h1>

            {listings.length === 0 ? (
                <p>No listings available yet.</p>
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