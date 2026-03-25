"use client";

// This component handles user registration
// It collects user information and creates a new account with Firebase

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpUser } from "@/lib/firebase/auth";

export default function SignupForm() {
    const router = useRouter();

    // Store form values
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Store UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        // Basic validation
        if (!fullName || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            setLoading(true);

            // Create user in Firebase Auth and save profile in Firestore
            await signUpUser(fullName, email, password);

            // Redirect user after signup
            router.push("/dashboard");
        } catch (err) {
            console.error("Signup error:", err);
            setError("Something went wrong while creating the account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-md space-y-4 rounded-lg border p-6 shadow-sm"
        >
            <h2 className="text-2xl font-bold">Sign Up</h2>

            {error && (
                <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div>
                <label className="mb-1 block font-medium">Full Name</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter your full name"
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Create a password"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Creating Account..." : "Sign Up"}
            </button>
        </form>
    );
}