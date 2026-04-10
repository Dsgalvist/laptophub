"use client";

// This component filters listings by brand, max price, RAM, storage, and location
// It sends the selected filter values back to the parent page

interface FilterBarProps {
  selectedBrand: string;
  maxPrice: string;
  selectedRam: string;
  selectedStorage: string;
  selectedLocation: string;
  onBrandChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onRamChange: (value: string) => void;
  onStorageChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function FilterBar({
  selectedBrand,
  maxPrice,
  selectedRam,
  selectedStorage,
  selectedLocation,
  onBrandChange,
  onPriceChange,
  onRamChange,
  onStorageChange,
  onLocationChange,
  onClearFilters,
}: FilterBarProps) {
  const formattedPrice = maxPrice
    ? new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
      }).format(Number(maxPrice))
    : "No limit";

  return (
    <div className="mb-6 grid gap-4 rounded-lg border border-gray-700 bg-[#1e293b] p-4 md:grid-cols-2 lg:grid-cols-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-white">
          Brand
        </label>
        <input
          type="text"
          value={selectedBrand}
          onChange={(event) => onBrandChange(event.target.value)}
          placeholder="Example: Dell"
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white">
          RAM
        </label>
        <input
          type="text"
          value={selectedRam}
          onChange={(event) => onRamChange(event.target.value)}
          placeholder="Example: 16GB"
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white">
          Storage
        </label>
        <input
          type="text"
          value={selectedStorage}
          onChange={(event) => onStorageChange(event.target.value)}
          placeholder="Example: 512GB SSD"
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white">
          Location
        </label>
        <input
          type="text"
          value={selectedLocation}
          onChange={(event) => onLocationChange(event.target.value)}
          placeholder="Example: Calgary"
          className="w-full rounded-md border border-gray-600 bg-[#0f172a] px-3 py-2 text-white"
        />
      </div>

      <div className="md:col-span-2 lg:col-span-2">
        <label className="mb-1 block text-sm font-medium text-white">
          Max Price: {formattedPrice}
        </label>
        <input
          type="range"
          min="0"
          max="5000"
          step="50"
          value={maxPrice || "5000"}
          onChange={(event) => onPriceChange(event.target.value)}
          className="w-full"
        />
      </div>

      <div className="md:col-span-2 lg:col-span-3">
        <button
          type="button"
          onClick={onClearFilters}
          className="rounded-md bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-600"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}