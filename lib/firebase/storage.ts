// This file handles image uploads to Firebase Storage
// It helps me upload listing images and get a URL to save in Firestore

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

export const uploadImage = async (file: File): Promise<string> => {
    // Create a unique file name using timestamp
    const fileName = `${Date.now()}-${file.name}`;

    // Create a reference in Firebase Storage
    const storageRef = ref(storage, `listings/${fileName}`);

    // Upload the file to Firebase
    await uploadBytes(storageRef, file);

    // Get the public URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    // Return the URL so it can be saved in Firestore
    return downloadURL;
};