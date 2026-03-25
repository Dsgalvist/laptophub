// This file handles database operations for listings and favorites
// It helps me create, read, update, and delete data in Firestore

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./config";
import type { Listing } from "@/types/listing";
import type { Favorite } from "@/types/favorite";

export const createListing = async (
    listingData: Omit<Listing, "listingId">
) => {
    // Add a new listing to Firestore (Firebase generates the ID)
    const docRef = await addDoc(collection(db, "listings"), listingData);

    // Return the generated document ID
    return docRef.id;
};

export const getListings = async (): Promise<Listing[]> => {
    // Get all listings from Firestore
    const querySnapshot = await getDocs(collection(db, "listings"));

    // Map each document into a Listing object
    return querySnapshot.docs.map((doc) => ({
        listingId: doc.id, // use Firestore document ID
        ...doc.data(),
    })) as Listing[];
};

export const getListingById = async (
    listingId: string
): Promise<Listing | null> => {
    // Get a single listing using its ID
    const docRef = doc(db, "listings", listingId);
    const docSnap = await getDoc(docRef);

    // If listing does not exist, return null
    if (!docSnap.exists()) {
        return null;
    }

    // Return listing data with ID
    return {
        listingId: docSnap.id,
        ...docSnap.data(),
    } as Listing;
};

export const updateListing = async (
    listingId: string,
    updatedData: Partial<Listing>
) => {
    // Update an existing listing
    const docRef = doc(db, "listings", listingId);
    await updateDoc(docRef, updatedData);
};

export const deleteListing = async (listingId: string) => {
    // Delete a listing from Firestore
    const docRef = doc(db, "listings", listingId);
    await deleteDoc(docRef);
};

export const getUserListings = async (sellerId: string): Promise<Listing[]> => {
    // Query listings that belong to a specific user
    const q = query(collection(db, "listings"), where("sellerId", "==", sellerId));

    const querySnapshot = await getDocs(q);

    // Return all listings created by the user
    return querySnapshot.docs.map((doc) => ({
        listingId: doc.id,
        ...doc.data(),
    })) as Listing[];
};

export const addFavorite = async (
    favoriteData: Omit<Favorite, "favoriteId">
) => {
    // Add a new favorite entry (connects user and listing)
    const docRef = await addDoc(collection(db, "favorites"), favoriteData);

    return docRef.id;
};

export const getUserFavorites = async (
    userId: string
): Promise<Favorite[]> => {
    // Get all favorites for a specific user
    const q = query(collection(db, "favorites"), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);

    // Return favorite records
    return querySnapshot.docs.map((doc) => ({
        favoriteId: doc.id,
        ...doc.data(),
    })) as Favorite[];
};

export const removeFavorite = async (favoriteId: string) => {
    // Remove a favorite entry from Firestore
    const docRef = doc(db, "favorites", favoriteId);
    await deleteDoc(docRef);
};