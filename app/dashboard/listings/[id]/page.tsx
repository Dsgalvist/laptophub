"use client";

// This page loads one listing and allows the owner to edit it

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getListingById } from "@/lib/firebase/firestore";
import ListingForm from "@/components/listings/ListingForm";
import type { Listing } from "@/types/listing";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [sellerId, setSellerId] = useState("");
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const currentListing = await getListingById(id);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            router.push("/login");
            return;
          }

          if (currentListing && currentListing.sellerId !== user.uid) {
            router.push("/dashboard/listings");
            return;
          }

          setSellerId(user.uid);
          setListing(currentListing);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error loading listing:", error);
        setLoading(false);
      }
    };

    loadPage();
  }, [id, router]);

  if (loading) {
    return <p className="p-6">Loading listing...</p>;
  }

  if (!listing || !sellerId) {
    return <p className="p-6">Listing not found.</p>;
  }

  return (
    <main className="p-6">
      <ListingForm
        sellerId={sellerId}
        existingListing={listing}
        isEditMode={true}
      />
    </main>
  );
}