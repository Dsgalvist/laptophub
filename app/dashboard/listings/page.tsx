"use client";

// This page shows only the listings created by the logged in user
// It also allows the user to edit or delete their listings

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { deleteListing, getUserListings } from "@/lib/firebase/firestore";
import ListingCard from "@/components/listings/ListingCard";
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

      setListings((prevListings) =>
        prevListings.filter((listing) => listing.listingId !== listingId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  if (loading) {
    return <p className="p-6 text-white">Loading your listings...</p>;
  }

  return (
    <main className="min-h-screen bg-[#0f172a] p-6 text-white">
      <h1 className="mb-4 text-2xl font-bold">My Listings</h1>

      {listings.length === 0 ? (
        <p>You have not created any listings yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.listingId}
              listing={listing}
              showActions={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
}