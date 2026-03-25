// This type represents a favorite item
// It helps me connect a user with a listing they saved
// This connects with FavoriteButton and favorites API routes
export interface Favorite {
    favoriteId: string;
    userId: string;
    listingId: string;
    createdAt: string;
}