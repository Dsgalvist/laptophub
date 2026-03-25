"use client";

// This page shows the form to create a new listing
// It uses the logged in user's ID as the sellerId

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import ListingForm from "@/components/listings/ListingForm";

export default function NewListingPage() {
    const [sellerId, setSellerId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setSellerId(user.uid);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <p className="p-6">Loading...</p>;
    }

    if (!sellerId) {
        return <p className="p-6">You must be logged in to create a listing.</p>;
    }

    return (
        <main className="p-6">
            <ListingForm sellerId={sellerId} />
        </main>
    );
}