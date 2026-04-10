"use client";

// This page shows the favorite listings saved by the logged in user

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getListingById, getUserFavorites } from "@/lib/firebase/firestore";
import ListingCard from "@/components/listings/ListingCard";
import type { Listing } from "@/types/listing";

export default function DashboardFavoritesPage() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const favoriteDocs = await getUserFavorites(user.uid);

          const favoriteListings = await Promise.all(
            favoriteDocs.map((favorite) => getListingById(favorite.listingId))
          );

          setFavorites(
            favoriteListings.filter((listing): listing is Listing => listing !== null)
          );
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="p-6 text-white">Loading favorites...</p>;
  }

  return (
    <main className="min-h-screen bg-[#0f172a] p-6 text-white">
      <h1 className="mb-4 text-2xl font-bold">My Favorites</h1>

      {favorites.length === 0 ? (
        <p>You have not saved any favorite listings yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((listing) => (
            <ListingCard key={listing.listingId} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}