import { NextResponse } from "next/server";
import { createVideo } from "../../../luma";

export async function GET(req) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({error:"Missing id"}, {status:400});
    const data = await getVideo(id);
    return NextResponse.json({
      id: data.id,
      state: data.state,
      video: data.assets?.video || null,
      failureReason: data.failure_reason || null
    });
  } catch (e) {
    return NextResponse.json({error:e.message || "Status check failed"}, {status:500});
  }
}
