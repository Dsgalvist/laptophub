// This type is used to define how a listing (laptop) looks in the app
// It helps me keep all listing data consistent across components and Firebase
// This connects with ListingForm, ListingCard, and the listings API
export interface Listing {
  listingId: string;
  sellerId: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  ram: string;
  storage: string;
  condition: string;
  description: string;
  imageUrl: string;
  location?: string;
  status: "available" | "sold";
  createdAt: string;
  updatedAt?: string;
}