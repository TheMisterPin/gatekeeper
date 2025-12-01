
import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/jsonDb";


export const runtime = "nodejs";


export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const appointmentId = params.id;
  
}
