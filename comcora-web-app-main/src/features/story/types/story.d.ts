export type TextBlock = {
  text: string | { en: string; ru: string; ee: string };
  primary?: boolean;
  bold?: boolean;
};

export type Slide = {
  id: string;
  image: string;
  align: "top" | "bottom";
  textBlocks: TextBlock[];
  action?: {
    type: "read" | "link";
    label: string | { en: string; ru: string; ee: string };
    data?: { url: string };
  };
};

export type Story = {
  id: string;
  title: string | { en: string; ru: string; ee: string };
  picture: string;
  read: boolean;
  slides: Slide[];
};
