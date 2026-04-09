"use client";

// This component allows a user to save or remove a favorite listing
// It connects the current user with a listing in Firestore

import { useEffect, useState } from "react";
import { addFavorite, getFavoriteByUserAndListing, removeFavorite } from "@/lib/firebase/firestore";

interface FavoriteButtonProps {
  userId: string;
  listingId: string;
}

export default function FavoriteButton({
  userId,
  listingId,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorite = await getFavoriteByUserAndListing(userId, listingId);

        if (favorite) {
          setIsFavorite(true);
          setFavoriteId(favorite.favoriteId);
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    if (userId && listingId) {
      checkFavorite();
    }
  }, [userId, listingId]);

  const handleToggleFavorite = async () => {
    try {
      setLoading(true);

      if (isFavorite) {
        await removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId("");
      } else {
        const newFavoriteId = await addFavorite({
          userId,
          listingId,
          createdAt: new Date().toISOString(),
        });

        setIsFavorite(true);
        setFavoriteId(newFavoriteId);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
    >
      {loading
        ? "Updating..."
        : isFavorite
        ? "Remove Favorite"
        : "Save to Favorites"}
    </button>
  );
}