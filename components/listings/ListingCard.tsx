// This component displays one listing as a card
// It is used to show basic listing information in pages like Listings and My Listings

import Link from "next/link";
import type { Listing } from "@/types/listing";

interface ListingCardProps {
    listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
            <img
                src={listing.imageUrl}
                alt={listing.title}
                className="h-48 w-full object-cover"
            />

            <div className="p-4">
                <h2 className="text-lg font-semibold">{listing.title}</h2>

                <p className="mt-1 text-sm text-gray-600">
                    {listing.brand} - {listing.model}
                </p>

                <p className="mt-2 font-medium text-black">${listing.price}</p>

                <p className="mt-1 text-sm text-gray-500">
                    {listing.ram} • {listing.storage}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                    Condition: {listing.condition}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                    Status: {listing.status}
                </p>

                <Link
                    href={`/listings/${listing.listingId}`}
                    className="mt-4 inline-block rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}