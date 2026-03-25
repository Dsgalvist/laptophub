import { NextResponse } from "next/server";

export async function DELETE() {
    return NextResponse.json(
        { message: "Favorite delete endpoint not implemented yet." },
        { status: 200 }
    );
}