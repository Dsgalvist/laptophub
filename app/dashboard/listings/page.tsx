"use client";

// This page shows only the listings created by the logged in user
// It also allows the user to edit or delete their listings

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { deleteListing, getUserListings } from "@/lib/firebase/firestore";
import type { Listing } from "@/types/listing";

export default function DashboardListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserListings = async (userId: string) => {
    try {
      const userListings = await getUserListings(userId);
      setListings(userListings);
    } catch (error) {
      console.error("Error loading user listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserListings(user.uid);
      } else {
        setListings([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (listingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      await deleteListing(listingId);

      // Remove deleted listing from UI
      setListings((prevListings) =>
        prevListings.filter((listing) => listing.listingId !== listingId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  if (loading) {
    return <p className="p-6">Loading your listings...</p>;
  }

  return (
    <main className="p-6 text-white">
      <h1 className="mb-4 text-2xl font-bold">My Listings</h1>

      {listings.length === 0 ? (
        <p>You have not created any listings yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div
              key={listing.listingId}
              className="rounded-lg border border-gray-700 bg-[#1e293b] p-4 shadow-sm"
            >
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="mb-2 h-40 w-full rounded object-cover"
              />

              <h2 className="text-lg font-semibold">{listing.title}</h2>
              <p className="text-sm text-gray-300">
                {listing.brand} - {listing.model}
              </p>
              <p className="mt-2 font-bold">${listing.price}</p>
              <p className="text-sm text-gray-400">{listing.condition}</p>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/dashboard/listings/${listing.listingId}`}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(listing.listingId)}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}