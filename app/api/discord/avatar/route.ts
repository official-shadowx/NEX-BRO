import { NextRequest, NextResponse } from "next/server";
import { DISCORD_AVATAR_HASH, DISCORD_USER_ID, GITHUB_USER } from "@/lib/constants";
import { avatarCdnUrl } from "@/lib/lanyard";
import fs from "fs";
import path from "path";

export const revalidate = 300;

function getLocalAvatar() {
  try {
    const filePath = path.join(process.cwd(), "public", "nexbro.jpg");
    if (fs.existsSync(filePath)) {
      const buf = fs.readFileSync(filePath);
      return new NextResponse(buf, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
        },
      });
    }
  } catch {
    /* ignore error */
  }
  return null;
}

async function fetchImage(url: string) {
  const upstream = await fetch(url, {
    headers: { Accept: "image/*", "User-Agent": "NEX-BRO-Portfolio" },
    next: { revalidate: 300 },
  });
  if (!upstream.ok) return null;
  const buf = await upstream.arrayBuffer();
  const type = upstream.headers.get("content-type") || "image/png";
  return { buf, type };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id") || DISCORD_USER_ID;
  const hash = searchParams.get("hash");
  const size = Number(searchParams.get("size") || "256") || 256;

  if (!hash || hash === "/nexbro.jpg" || hash === DISCORD_AVATAR_HASH) {
    const local = getLocalAvatar();
    if (local) return local;
  }

  const urls: string[] = [];
  if (hash && hash !== "/nexbro.jpg") {
    urls.push(avatarCdnUrl(id, hash, size));
  }
  urls.push(`https://github.com/${GITHUB_USER}.png?size=${size}`);

  for (const url of urls) {
    try {
      const img = await fetchImage(url);
      if (img) {
        return new NextResponse(img.buf, {
          headers: {
            "Content-Type": img.type,
            "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
          },
        });
      }
    } catch {
      /* try next source */
    }
  }

  const fallback = getLocalAvatar();
  if (fallback) return fallback;

  return new NextResponse("avatar unavailable", { status: 404 });
}
