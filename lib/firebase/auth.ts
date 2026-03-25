import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./config";
import type { UserProfile } from "@/types/user";

const googleProvider = new GoogleAuthProvider();

export const signUpUser = async (
    fullName: string,
    email: string,
    password: string
): Promise<UserProfile> => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    const user = userCredential.user;

    const userProfile: UserProfile = {
        userId: user.uid,
        fullName,
        email: user.email || email,
        createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", user.uid), userProfile);

    return userProfile;
};

export const loginUser = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const loginWithGoogle = async (): Promise<UserProfile> => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const userProfile: UserProfile = {
        userId: user.uid,
        fullName: user.displayName || "Google User",
        email: user.email || "",
        photoUrl: user.photoURL || "",
        createdAt: new Date().toISOString(),
    };

    // Only save the profile if it does not exist yet
    if (!userSnap.exists()) {
        await setDoc(userRef, userProfile);
    }

    return userProfile;
};

export const logoutUser = async () => {
    await signOut(auth);
};