// This is the home page of the app
// It introduces LaptopHub and directs users to browse listings

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          Buy and Sell Laptops Easily
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
          LaptopHub is a simple marketplace where users can list, browse, and
          find laptops based on their needs. Save favorites and manage your own
          listings all in one place.
        </p>

        <Link
          href="/listings"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Browse Listings
        </Link>
      </section>

      {/* Features Section */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        <div className="rounded-xl border border-gray-700 bg-[#1e293b] p-6 shadow-md">
          <h2 className="mb-3 text-2xl font-semibold text-white">
            Create Listings
          </h2>
          <p className="text-gray-300">
            Add your laptop details and create listings in a simple and
            organized way.
          </p>
        </div>

        <div className="rounded-xl border border-gray-700 bg-[#1e293b] p-6 shadow-md">
          <h2 className="mb-3 text-2xl font-semibold text-white">
            Browse Laptops
          </h2>
          <p className="text-gray-300">
            Explore available laptops and compare options based on your needs
            and budget.
          </p>
        </div>

        <div className="rounded-xl border border-gray-700 bg-[#1e293b] p-6 shadow-md">
          <h2 className="mb-3 text-2xl font-semibold text-white">
            Save Favorites
          </h2>
          <p className="text-gray-300">
            Keep track of laptops you like and access them easily from your
            dashboard.
          </p>
        </div>
      </section>
    </main>
  );
}