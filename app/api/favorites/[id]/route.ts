import { NextResponse } from "next/server";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing favorite ID." },
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, "favorites", id));

    return NextResponse.json(
      { message: "Favorite removed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting favorite:", error);

    return NextResponse.json(
      { error: "Failed to delete favorite." },
      { status: 500 }
    );
  }
}