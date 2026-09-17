const BASE = "https://api.lumalabs.ai/dream-machine/v1";

function headers() {
  if (!process.env.LUMA_API_KEY) throw new Error("LUMA_API_KEY is missing");
  return {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": `Bearer ${process.env.LUMA_API_KEY}`,
  };
}

export async function createVideo({prompt, style, aspectRatio}) {
  const stylePrompt = style === "Cartoon"
    ? "3D animated cartoon, cute expressive characters, polished family-friendly animation, vibrant lighting. "
    : "cinematic realistic video, natural lighting, detailed textures. ";

  const res = await fetch(`${BASE}/generations/video`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      prompt: stylePrompt + prompt,
      model: "ray-2",
      resolution: "720p",
      duration: "5s",
      aspect_ratio: aspectRatio
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Luma create failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function getVideo(id) {
  const res = await fetch(`${BASE}/generations/${encodeURIComponent(id)}`, {
    headers: { "accept": "application/json", "authorization": `Bearer ${process.env.LUMA_API_KEY}` },
    cache: "no-store"
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Luma status failed (${res.status}): ${text}`);
  }
  return res.json();
}
