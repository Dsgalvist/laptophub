"use client";

// This page shows the details of one listing
// It gets the listing ID from the URL and loads the full listing data

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getListingById } from "@/lib/firebase/firestore";
import type { Listing } from "@/types/listing";

export default function ListingDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                // Get one listing using the ID from the route
                const data = await getListingById(id);
                setListing(data);
            } catch (error) {
                console.error("Error loading listing:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchListing();
        }
    }, [id]);

    if (loading) {
        return <p className="p-6">Loading listing details...</p>;
    }

    if (!listing) {
        return <p className="p-6">Listing not found.</p>;
    }

    return (
        <main className="mx-auto max-w-4xl p-6">
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="h-96 w-full object-cover"
                />

                <div className="space-y-3 p-6">
                    <h1 className="text-3xl font-bold">{listing.title}</h1>

                    <p className="text-lg text-gray-600">
                        {listing.brand} - {listing.model}
                    </p>

                    <p className="text-2xl font-semibold">${listing.price}</p>

                    <div className="grid gap-2 text-sm text-gray-700 md:grid-cols-2">
                        <p>
                            <span className="font-medium">RAM:</span> {listing.ram}
                        </p>
                        <p>
                            <span className="font-medium">Storage:</span> {listing.storage}
                        </p>
                        <p>
                            <span className="font-medium">Condition:</span> {listing.condition}
                        </p>
                        <p>
                            <span className="font-medium">Status:</span> {listing.status}
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-2 text-xl font-semibold">Description</h2>
                        <p className="text-gray-700">{listing.description}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}