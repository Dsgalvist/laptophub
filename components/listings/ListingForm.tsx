"use client";

// This component is used to create a new listing
// It collects the form data, uploads the image, and saves the listing in Firestore

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createListing } from "@/lib/firebase/firestore";
import { uploadImage } from "@/lib/firebase/storage";
import type { Listing } from "@/types/listing";

interface ListingFormProps {
    sellerId: string;
}

export default function ListingForm({ sellerId }: ListingFormProps) {
    const router = useRouter();

    // Form fields
    const [title, setTitle] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [price, setPrice] = useState("");
    const [ram, setRam] = useState("");
    const [storage, setStorage] = useState("");
    const [condition, setCondition] = useState("");
    const [description, setDescription] = useState("");

    // Image file
    const [imageFile, setImageFile] = useState<File | null>(null);

    // UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Get the selected image file from the input
        const file = event.target.files?.[0] || null;
        setImageFile(file);
    };

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
            !description
        ) {
            setError("Please fill in all fields and upload an image.");
            return;
        }

        try {
            setLoading(true);

            // Upload image first and get its URL
            const imageUrl = "https://via.placeholder.com/400";

            // Prepare listing data without listingId
            const newListing: Omit<Listing, "listingId"> = {
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
                status: "available",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Save listing data in Firestore
            await createListing(newListing);

            setSuccess("Listing created successfully.");

            // Clear form
            setTitle("");
            setBrand("");
            setModel("");
            setPrice("");
            setRam("");
            setStorage("");
            setCondition("");
            setDescription("");

            // Redirect after creating the listing
            router.push("/dashboard/listings");
        } catch (err) {
            console.error("Error creating listing:", err);
            setError("Something went wrong while creating the listing.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl space-y-4 rounded-lg border p-6 shadow-sm"
        >
            <h2 className="text-2xl font-bold">Add New Listing</h2>

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
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter listing title"
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Brand</label>
                <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter laptop brand"
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Model</label>
                <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter laptop model"
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter price"
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">RAM</label>
                <input
                    type="text"
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Example: 16GB"
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Storage</label>
                <input
                    type="text"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Example: 512GB SSD"
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Condition</label>
                <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
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
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    rows={4}
                    placeholder="Enter listing description"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Creating Listing..." : "Create Listing"}
            </button>
        </form>
    );
}