"use client";

// This page shows the details of one listing
// It gets the listing ID from the URL, loads the full listing data,
// and uses a geocoding API to show the location on a map

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getListingById } from "@/lib/firebase/firestore";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import { getCoordinates } from "@/lib/helpers/geocode";
import type { Listing } from "@/types/listing";

interface Coordinates {
  lat: string;
  lon: string;
}

export default function ListingDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [userId, setUserId] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a user is logged in
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
        // Get listing data from Firestore
        const data = await getListingById(id);
        setListing(data);

        // If the listing has a location, fetch map coordinates
        if (data?.location) {
          const coords = await getCoordinates(data.location);
          setCoordinates(coords);
        }
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
    return <p className="p-6 text-white">Loading listing details...</p>;
  }

  if (!listing) {
    return <p className="p-6 text-white">Listing not found.</p>;
  }

  return (
    <main className="min-h-screen bg-[#0f172a] p-6 text-white">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-gray-700 bg-[#1e293b] shadow-sm">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="h-96 w-full object-cover"
        />

        <div className="space-y-4 p-6">
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

            <p>
              <span className="font-medium text-white">Location:</span>{" "}
              {listing.location || "Not specified"}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p className="text-gray-300">{listing.description}</p>
          </div>

          {coordinates && (
            <div className="rounded-lg border border-gray-700 bg-[#0f172a] p-4">
              <h2 className="mb-2 text-lg font-semibold">Location Map</h2>

              <p className="text-sm text-gray-300">
                Coordinates: {coordinates.lat}, {coordinates.lon}
              </p>

              <a
                href={`https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lon}#map=12/${coordinates.lat}/${coordinates.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
              >
                Open in Map
              </a>
            </div>
          )}

          {userId && (
            <FavoriteButton userId={userId} listingId={listing.listingId} />
          )}
        </div>
      </div>
    </main>
  );
}