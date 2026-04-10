import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter." },
        { status: 400 },
      );
    }

    const q = query(collection(db, "favorites"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const favorites = querySnapshot.docs.map((doc) => ({
      favoriteId: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error("Error fetching favorites:", error);

    return NextResponse.json(
      { error: "Failed to fetch favorites." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, listingId, createdAt } = body;

    if (!userId || !listingId || !createdAt) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    const docRef = await addDoc(collection(db, "favorites"), {
      userId,
      listingId,
      createdAt,
    });

    return NextResponse.json(
      { favoriteId: docRef.id, userId, listingId, createdAt },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding favorite:", error);

    return NextResponse.json(
      { error: "Failed to add favorite." },
      { status: 500 },
    );
  }
}
