"use client";

// This page shows the favorite listings saved by the logged in user

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getListingById, getUserFavorites } from "@/lib/firebase/firestore";
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
    return <p className="p-6">Loading favorites...</p>;
  }

  return (
    <main className="p-6 text-white">
      <h1 className="mb-4 text-2xl font-bold">My Favorites</h1>

      {favorites.length === 0 ? (
        <p>You have not saved any favorite listings yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((listing) => (
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}