import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const prompt = String(body?.prompt || "").trim();

    const style =
      body?.style === "Realistic"
        ? "Realistic"
        : "Cartoon";

    const allowedRatios = ["9:16", "16:9", "1:1", "4:3", "3:4"];
    const aspectRatio = allowedRatios.includes(body?.aspectRatio)
      ? body.aspectRatio
      : "9:16";

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length > 5000) {
      return NextResponse.json(
        { error: "Prompt is too long" },
        { status: 400 }
      );
    }

    // Server-side only
    const apiKey = process.env.LUMA_API_KEY?.trim();

    if (!apiKey) {
      console.error("LUMA_API_KEY is missing");
      return NextResponse.json(
        { error: "LUMA_API_KEY is not configured on the server" },
        { status: 500 }
      );
    }

    const finalPrompt =
      style === "Realistic"
        ? `Realistic cinematic video: ${prompt}`
        : `Cute animated cartoon video: ${prompt}`;

    const response = await fetch(
      "https://api.lumalabs.ai/dream-machine/v1/generations/video",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          generation_type: "video",
          prompt: finalPrompt,
          model: "ray-flash-2",
          aspect_ratio: aspectRatio,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Luma API error:", data);

      return NextResponse.json(
        {
          error:
            data?.detail ||
            data?.message ||
            data?.error ||
            `Luma API error (${response.status})`,
        },
        { status: response.status >= 400 ? response.status : 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      state: data.state || "queued",
    });
  } catch (error) {
    console.error("Generate route error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Video generation failed",
      },
      { status: 500 }
    );
  }
      }
