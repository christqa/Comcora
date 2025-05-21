export interface StickerResult {
  id: string;
  title: string;
  media_formats: StickerMediaFormats;
  created: number;
  content_description: string;
  itemurl: string;
  url: string;
  tags: string[];
  flags: unknown[];
  hasaudio: boolean;
}

export interface StickerMediaFormats {
  tinygif: Tinygif;
}

export interface Tinygif {
  url: string;
  duration: number;
  preview: string;
  dims: number[];
  size: number;
}
