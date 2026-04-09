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
  listingData: Omit<Listing, "listingId">,
) => {
  const docRef = await addDoc(collection(db, "listings"), listingData);
  return docRef.id;
};

export const getListings = async (): Promise<Listing[]> => {
  const querySnapshot = await getDocs(collection(db, "listings"));

  return querySnapshot.docs.map((doc) => ({
    listingId: doc.id,
    ...doc.data(),
  })) as Listing[];
};

export const getListingById = async (
  listingId: string,
): Promise<Listing | null> => {
  const docRef = doc(db, "listings", listingId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    listingId: docSnap.id,
    ...docSnap.data(),
  } as Listing;
};

export const updateListing = async (
  listingId: string,
  updatedData: Partial<Listing>,
) => {
  const docRef = doc(db, "listings", listingId);
  await updateDoc(docRef, updatedData);
};

export const deleteListing = async (listingId: string) => {
  const docRef = doc(db, "listings", listingId);
  await deleteDoc(docRef);
};

export const getUserListings = async (sellerId: string): Promise<Listing[]> => {
  const q = query(
    collection(db, "listings"),
    where("sellerId", "==", sellerId),
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    listingId: doc.id,
    ...doc.data(),
  })) as Listing[];
};

export const addFavorite = async (
  favoriteData: Omit<Favorite, "favoriteId">,
) => {
  const docRef = await addDoc(collection(db, "favorites"), favoriteData);
  return docRef.id;
};

export const getUserFavorites = async (userId: string): Promise<Favorite[]> => {
  const q = query(collection(db, "favorites"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    favoriteId: doc.id,
    ...doc.data(),
  })) as Favorite[];
};

export const removeFavorite = async (favoriteId: string) => {
  const docRef = doc(db, "favorites", favoriteId);
  await deleteDoc(docRef);
};

export const getFavoriteByUserAndListing = async (
  userId: string,
  listingId: string,
): Promise<Favorite | null> => {
  const q = query(
    collection(db, "favorites"),
    where("userId", "==", userId),
    where("listingId", "==", listingId),
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const favoriteDoc = querySnapshot.docs[0];

  return {
    favoriteId: favoriteDoc.id,
    ...favoriteDoc.data(),
  } as Favorite;
};
