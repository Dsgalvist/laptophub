"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, loginWithGoogle } from "@/lib/firebase/auth";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);
            await loginUser(email, password);
            router.push("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");

        try {
            setGoogleLoading(true);
            await loginWithGoogle();
            router.push("/dashboard");
        } catch (err) {
            console.error("Google login error:", err);
            setError("Something went wrong with Google login.");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-md space-y-4 rounded-lg border p-6 shadow-sm"
        >
            <h2 className="text-2xl font-bold">Login</h2>

            {error && (
                <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

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
                    placeholder="Enter your password"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full rounded-md border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
                {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>
        </form>
    );
}