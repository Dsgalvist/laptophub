import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(
        { message: "Single listing endpoint not implemented yet." },
        { status: 200 }
    );
}