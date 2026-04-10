"use client";

// This component is used to create or edit a listing
// It collects the form data and saves changes in Firestore

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createListing, updateListing } from "@/lib/firebase/firestore";
import type { Listing } from "@/types/listing";

interface ListingFormProps {
  sellerId: string;
  existingListing?: Listing | null;
  isEditMode?: boolean;
}

export default function ListingForm({
  sellerId,
  existingListing = null,
  isEditMode = false,
}: ListingFormProps) {
  const router = useRouter();

  // Store form values
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // Store UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fill the form if editing an existing listing
    if (existingListing) {
      setTitle(existingListing.title);
      setBrand(existingListing.brand);
      setModel(existingListing.model);
      setPrice(existingListing.price.toString());
      setRam(existingListing.ram);
      setStorage(existingListing.storage);
      setCondition(existingListing.condition);
      setDescription(existingListing.description);
      setLocation(existingListing.location || "");
    }
  }, [existingListing]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (
      !title ||
      !brand ||
      !model ||
      !price ||
      !ram ||
      !storage ||
      !condition ||
      !description ||
      !location
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      // Placeholder image is used because Firebase Storage is not enabled
      const imageUrl =
        existingListing?.imageUrl || "https://via.placeholder.com/400";

      const listingData: Omit<Listing, "listingId"> = {
        sellerId,
        title,
        brand,
        model,
        price: Number(price),
        ram,
        storage,
        condition,
        description,
        imageUrl,
        location,
        status: existingListing?.status || "available",
        createdAt: existingListing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode && existingListing) {
        // Update an existing listing
        await updateListing(existingListing.listingId, listingData);
        setSuccess("Listing updated successfully.");
      } else {
        // Create a new listing
        await createListing(listingData);
        setSuccess("Listing created successfully.");
      }

      router.push("/dashboard/listings");
    } catch (err) {
      console.error("Error saving listing:", err);
      setError("Something went wrong while saving the listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-4 rounded-lg border border-gray-700 bg-[#1e293b] p-6 shadow-sm text-white"
    >
      <h2 className="text-2xl font-bold">
        {isEditMode ? "Edit Listing" : "Add New Listing"}
      </h2>

      {error && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-700">
          {success}
        </p>
      )}

      <div>
        <label className="mb-1 block font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
          placeholder="Enter listing title"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Brand</label>
        <input
          type="text"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
          placeholder="Enter laptop brand"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Model</label>
        <input
          type="text"
          value={model}
          onChange={(event) => setModel(event.target.value)}
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
          placeholder="Enter laptop model"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Price</label>
        <input
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
          placeholder="Enter price"
          step={50}
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">RAM</label>
        <input
          type="text"
          value={ram}
          onChange={(event) => setRam(event.target.value)}
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
          placeholder="Example: 16GB"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Storage</label>
        <input
          type="text"
          value={storage}
          onChange={(event) => setStorage(event.target.value)}
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
          placeholder="Example: 512GB SSD"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Location</label>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
          placeholder="Example: Calgary"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Condition</label>
        <select
          value={condition}
          onChange={(event) => setCondition(event.target.value)}
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
        >
          <option value="">Select condition</option>
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
          rows={4}
          placeholder="Enter listing description"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? isEditMode
            ? "Updating Listing..."
            : "Creating Listing..."
          : isEditMode
          ? "Update Listing"
          : "Create Listing"}
      </button>
    </form>
  );
}