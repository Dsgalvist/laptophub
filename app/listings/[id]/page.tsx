"use client";

// This page shows the details of one listing
// It gets the listing ID from the URL and loads the full listing data

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getListingById } from "@/lib/firebase/firestore";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import type { Listing } from "@/types/listing";

export default function ListingDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchListing = async () => {
      try {
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
    <main className="mx-auto max-w-4xl p-6 text-white">
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-[#1e293b] shadow-sm">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="h-96 w-full object-cover"
        />

        <div className="space-y-3 p-6">
          <h1 className="text-3xl font-bold">{listing.title}</h1>

          <p className="text-lg text-gray-300">
            {listing.brand} - {listing.model}
          </p>

          <p className="text-2xl font-semibold">${listing.price}</p>

          <div className="grid gap-2 text-sm text-gray-300 md:grid-cols-2">
            <p>
              <span className="font-medium text-white">RAM:</span> {listing.ram}
            </p>
            <p>
              <span className="font-medium text-white">Storage:</span>{" "}
              {listing.storage}
            </p>
            <p>
              <span className="font-medium text-white">Condition:</span>{" "}
              {listing.condition}
            </p>
            <p>
              <span className="font-medium text-white">Status:</span>{" "}
              {listing.status}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p className="text-gray-300">{listing.description}</p>
          </div>

          {userId && <FavoriteButton userId={userId} listingId={listing.listingId} />}
        </div>
      </div>
    </main>
  );
}