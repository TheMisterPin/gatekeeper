
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Simple proxy to OpenAI Whisper.
 *
 * The client should send a POST with multipart/form-data containing:
 * - file: Blob/File audio (webm, wav, mp3, etc.)
 *
 * Example client-side usage:
 *
 * const formData = new FormData();
 * formData.append("file", audioBlob, "audio.webm");
 * await fetch("/api/voice/transcribe", { method: "POST", body: formData });
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type multipart/form-data richiesto" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Campo 'file' mancante o non valido" },
        { status: 400 }
      );
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY non configurata sul server" },
        { status: 500 }
      );
    }

    const forwardFormData = new FormData();
    forwardFormData.append("file", file);
    forwardFormData.append("model", "whisper-1");
    forwardFormData.append("language", "it"); // forzare italiano per maggior robustezza

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiKey}`,
        },
        body: forwardFormData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI Whisper error:", errorText);
      return NextResponse.json(
        {
          error: "Errore nella chiamata a Whisper",
          details: errorText,
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      text: data.text ?? "",
      raw: data,
    });
  } catch (err: any) {
    console.error("Transcription route error:", err);
    return NextResponse.json(
      {
        error: "Errore interno durante la trascrizione audio",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
