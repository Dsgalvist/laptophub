// This type defines the structure of a user in the app
// It helps me manage user data from Firebase Auth and Firestore
// This connects with login/signup and ProtectedRoute
export interface UserProfile {
    userId: string;
    fullName: string;
    email: string;
    photoUrl?: string;
    createdAt: string;
}