"use client";

// This component displays one listing as a reusable card
// It can be used in public listings, user listings, and favorites

import Link from "next/link";
import type { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
  showActions?: boolean;
  onDelete?: (listingId: string) => void;
}

export default function ListingCard({
  listing,
  showActions = false,
  onDelete,
}: ListingCardProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-[#1e293b] p-4 shadow-sm text-white">
      <img
        src={listing.imageUrl}
        alt={listing.title}
        className="mb-3 h-40 w-full rounded object-cover"
      />

      <h2 className="text-lg font-semibold">{listing.title}</h2>

      <p className="text-sm text-gray-300">
        {listing.brand} - {listing.model}
      </p>

      <p className="mt-2 font-bold text-white">${listing.price}</p>

      <p className="text-sm text-gray-400">
        {listing.ram} • {listing.storage}
      </p>

      <p className="text-sm text-gray-400">
        {listing.location || "Location not specified"}
      </p>

      <p className="text-sm text-gray-400">
        Condition: {listing.condition}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/listings/${listing.listingId}`}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
        >
          View Details
        </Link>

        {showActions && (
          <>
            <Link
              href={`/dashboard/listings/${listing.listingId}`}
              className="rounded-md bg-green-600 px-4 py-2 text-sm text-white transition hover:bg-green-700"
            >
              Edit
            </Link>

            <button
              onClick={() => onDelete?.(listing.listingId)}
              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}