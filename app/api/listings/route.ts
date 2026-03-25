import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(
        { message: "Listings endpoint not implemented yet." },
        { status: 200 }
    );
}