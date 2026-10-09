"use client";

import { useEffect, useRef, useState } from "react";
import { DISCORD_AVATAR_HASH, DISCORD_USER_ID, DISCORD_USERNAME, DISPLAY_NAME } from "@/lib/constants";
import { emptyPresence, type LanyardData, type LanyardState } from "@/lib/lanyard";

const SOCKET = "wss://api.lanyard.rest/socket";

type Incoming =
  | { op: 1; d: { heartbeat_interval: number } }
  | { op: 0; t: "INIT_STATE" | "PRESENCE_UPDATE"; d: LanyardData | Record<string, LanyardData> }
  | { op: number; d?: unknown; t?: string };

const fallbackUser: LanyardData["discord_user"] = {
  id: DISCORD_USER_ID,
  username: DISCORD_USERNAME,
  global_name: DISPLAY_NAME,
  avatar: "/nexbro.jpg",
  discriminator: "0",
  display_name: DISPLAY_NAME,
};

function sanitizeLanyard(data: LanyardData | null): LanyardData | null {
  if (!data) return data;
  if (data.discord_user) {
    data.discord_user.global_name = DISPLAY_NAME;
    data.discord_user.display_name = DISPLAY_NAME;
    data.discord_user.username = DISCORD_USERNAME;
    data.discord_user.avatar = "/nexbro.jpg";
  }
  return data;
}

export function useLanyard() {
  const [state, setState] = useState<LanyardState>({
    loading: true,
    connected: false,
    data: emptyPresence(fallbackUser),
  });
  const heartbeat = useRef<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;

    const hydrateRest = async () => {
      try {
        const res = await fetch("/api/discord", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) {
            setState((prev) => ({ ...prev, loading: false, data: prev.data ?? emptyPresence(fallbackUser) }));
          }
          return;
        }
        const json = (await res.json()) as { success: boolean; data: LanyardData };
        if (!cancelled && json.success && json.data) {
          setState((prev) => ({
            loading: false,
            connected: prev.connected,
            data: sanitizeLanyard(json.data),
          }));
        } else if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            data: prev.data ?? emptyPresence(fallbackUser),
          }));
        }
      }
    };

    hydrateRest();

    const connect = () => {
      if (cancelled) return;
      const ws = new WebSocket(SOCKET);
      socketRef.current = ws;

      ws.onopen = () => {
        setState((prev) => ({ ...prev, connected: true }));
      };

      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data) as Incoming;

        if (payload.op === 1) {
          const interval = (payload.d as { heartbeat_interval: number }).heartbeat_interval;
          if (heartbeat.current) window.clearInterval(heartbeat.current);
          heartbeat.current = window.setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, interval);
          ws.send(
            JSON.stringify({
              op: 2,
              d: { subscribe_to_id: DISCORD_USER_ID },
            }),
          );
          return;
        }

        if (payload.op === 0 && (payload.t === "INIT_STATE" || payload.t === "PRESENCE_UPDATE")) {
          const raw = payload.d;
          const data =
            raw && typeof raw === "object" && "discord_user" in raw
              ? (raw as LanyardData)
              : (Object.values(raw as Record<string, LanyardData>)[0] ?? null);
          if (data?.discord_user) {
            const sanitized = sanitizeLanyard(data);
            setState({ loading: false, connected: true, data: sanitized });
          }
        }
      };

      ws.onclose = () => {
        setState((prev) => ({ ...prev, connected: false }));
        if (heartbeat.current) window.clearInterval(heartbeat.current);
        if (!cancelled) window.setTimeout(connect, 2500);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (heartbeat.current) window.clearInterval(heartbeat.current);
      socketRef.current?.close();
    };
  }, []);

  return state;
}
