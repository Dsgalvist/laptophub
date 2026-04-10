"use client";

// This page displays all listings from Firestore
// It also allows users to filter listings by brand, price, RAM, storage, and location

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getListings } from "@/lib/firebase/firestore";
import FilterBar from "@/components/listings/FilterBar";
import type { Listing } from "@/types/listing";

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesBrand = selectedBrand
        ? listing.brand.toLowerCase().includes(selectedBrand.toLowerCase())
        : true;

      const matchesPrice = maxPrice
        ? listing.price <= Number(maxPrice)
        : true;

      const matchesRam = selectedRam
        ? listing.ram.toLowerCase().includes(selectedRam.toLowerCase())
        : true;

      const matchesStorage = selectedStorage
        ? listing.storage.toLowerCase().includes(selectedStorage.toLowerCase())
        : true;

      const matchesLocation = selectedLocation
        ? (listing.location || "")
            .toLowerCase()
            .includes(selectedLocation.toLowerCase())
        : true;

      return (
        matchesBrand &&
        matchesPrice &&
        matchesRam &&
        matchesStorage &&
        matchesLocation
      );
    });
  }, [
    listings,
    selectedBrand,
    maxPrice,
    selectedRam,
    selectedStorage,
    selectedLocation,
  ]);

  if (loading) {
    return <p className="p-6 text-white">Loading listings...</p>;
  }

  return (
    <main className="min-h-screen bg-[#0f172a] p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">All Listings</h1>

      <FilterBar
        selectedBrand={selectedBrand}
        maxPrice={maxPrice}
        selectedRam={selectedRam}
        selectedStorage={selectedStorage}
        selectedLocation={selectedLocation}
        onBrandChange={setSelectedBrand}
        onPriceChange={setMaxPrice}
        onRamChange={setSelectedRam}
        onStorageChange={setSelectedStorage}
        onLocationChange={setSelectedLocation}
      />

      {filteredListings.length === 0 ? (
        <p>No listings match your filters.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <div
              key={listing.listingId}
              className="rounded-lg border border-gray-700 bg-[#1e293b] p-4 shadow-sm"
            >
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="mb-3 h-40 w-full rounded object-cover"
              />

              <h2 className="text-lg font-semibold">{listing.title}</h2>
              <p className="text-sm text-gray-300">
                {listing.brand} - {listing.model}
              </p>
              <p className="mt-2 font-bold">${listing.price}</p>
              <p className="text-sm text-gray-400">
                {listing.ram} • {listing.storage}
              </p>
              <p className="text-sm text-gray-400">
                {listing.location || "Location not specified"}
              </p>

              <Link
                href={`/listings/${listing.listingId}`}
                className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}