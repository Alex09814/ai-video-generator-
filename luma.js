const BASE =
  "https://api.lumalabs.ai/dream-machine/v1";

function headers() {
  const key = process.env.LUMAAI_API_KEY;

  if (!key) {
    throw new Error("LUMAAI_API_KEY is not configured");
  }

  return {
    accept: "application/json",
    "content-type": "application/json",
    authorization: `Bearer ${key}`,
  };
}

export async function createVideo({
  prompt,
  style = "Cartoon",
  aspectRatio = "9:16",
}) {
  const stylePrompt =
    style === "Cartoon"
      ? "3D animated cartoon, cute expressive characters, smooth animation, "
      : "cinematic realistic video, natural lighting, realistic details, ";

  const res = await fetch(`${BASE}/generations`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      prompt: stylePrompt + prompt,
      model: "ray-2",
      resolution: "720p",
      duration: "5s",
      aspect_ratio: aspectRatio,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Luma create failed (${res.status}): ${text}`);
  }

  return res.json();
}

export async function getVideo(id) {
  const res = await fetch(`${BASE}/generations/${id}`, {
    method: "GET",
    headers: headers(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Luma status failed (${res.status}): ${text}`);
  }

  return res.json();
    }
