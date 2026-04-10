"use client";

// This component allows a user to save or remove a favorite listing
// It uses API routes to connect the frontend with backend logic

import { useEffect, useState } from "react";
import { getFavoriteByUserAndListing } from "@/lib/firebase/firestore";

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
        const response = await fetch(`/api/favorites/${favoriteId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to remove favorite.");
        }

        setIsFavorite(false);
        setFavoriteId("");
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            listingId,
            createdAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save favorite.");
        }

        const newFavorite = await response.json();

        setIsFavorite(true);
        setFavoriteId(newFavorite.favoriteId);
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