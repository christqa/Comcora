"use client";

import { useCallback } from "react";
import { type StickerResult } from "@/features/stickers/lib/types";

const apikey = process.env.TENOR_API_KEY;
const url = "https://tenor.googleapis.com/v2/search?";

export default function useStickers() {
  const fetchStickers = useCallback(async (query: string, limit: number) => {
    try {
      const response = await fetch(
        `${url}q=${query}&key=${apikey}&limit=${limit}&media_filter=tinygif`
      );
      const data = await response.json();
      return data.results as StickerResult[];
    } catch (error) {
      console.error("Error fetching stickers:", error);
      return [];
    }
  }, []);

  return { fetchStickers };
}
