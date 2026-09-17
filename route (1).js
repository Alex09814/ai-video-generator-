import { NextResponse } from "next/server";
import { createVideo } from "../../../lib/luma";

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = String(body.prompt || "").trim();
    const style = body.style === "Realistic" ? "Realistic" : "Cartoon";
    const aspectRatio = ["9:16","16:9","1:1"].includes(body.aspectRatio) ? body.aspectRatio : "9:16";

    if (!prompt) return NextResponse.json({error:"Prompt is required"}, {status:400});
    if (prompt.length > 2000) return NextResponse.json({error:"Prompt is too long"}, {status:400});

    const generation = await createVideo({prompt, style, aspectRatio});
    return NextResponse.json({id:generation.id, state:generation.state});
  } catch (e) {
    return NextResponse.json({error:e.message || "Generation failed"}, {status:500});
  }
}