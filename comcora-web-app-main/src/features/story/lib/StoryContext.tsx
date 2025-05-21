"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { type Slide, type Story } from "@/features/story/types/story";
import { api } from "@/features/trpc-client/hooks/react";
import { type StoryViewDTO } from "@xdatagroup/tbb-sdk/dist/api/services/story/models";

import { randomId } from "@/lib/random-id";

export const threeSlides: Slide[] = [
  {
    id: randomId(),
    textBlocks: [
      {
        text: {
          en: "Get and transfer instantly",
          ru: "Получай\nи переводи моментально",
          ee: "Saada ja edasta hetkega",
        },
        primary: true,
      },
    ],
    image: "/demo/story-fullpic-01.png",
    align: "bottom",
    action: {
      label: {
        en: "Try it",
        ru: "Попробовать",
        ee: "Proovi",
      },
      type: "read",
    },
  },
  {
    id: randomId(),
    textBlocks: [
      {
        text: {
          en: "Tallinn is becoming a financial giant",
          ru: "Таллин становится финансовым гигантом",
          ee: "Tallinnast saab rahandushiid",
        },
        primary: true,
      },
      {
        text: {
          en: "A new way to make fast and profitable payments - without additional fees!",
          ru: "Новый способ быстрого и выгодного платежа - без дополнительных комиссий!",
          ee: "Uus viis kiireks ja kasulikuks makseks - ilma lisatasudeta!",
        },
      },
    ],
    image: "/demo/story-fullpic-02.png",
    align: "bottom",
    action: {
      label: {
        en: "Read article",
        ru: "Читать статью",
        ee: "Loe artiklit",
      },
      type: "read",
    },
  },
  {
    id: randomId(),
    textBlocks: [
      {
        text: {
          en: "Opinion of a banking expert",
          ru: "Мнение\nбанковского\nэксперта",
          ee: "Panganduseksperdi arvamus",
        },
        primary: true,
      },
      {
        text: {
          en: "From Dmitry Dubaisky",
          ru: "От Дмитрия Дубайского",
          ee: "Dmitri Dubaiskilt",
        },
      },
    ],
    image: "/demo/story-fullpic-03.jpg",
    align: "top",
    action: {
      label: {
        en: "Read article",
        ru: "Читать статью",
        ee: "Loe artiklit",
      },
      type: "read",
    },
  },
];

export const storiesMock: Story[] = [
  {
    id: randomId(),
    title: {
      en: "How to make transfers",
      ru: "Как переводить средства",
      ee: "Kuidas raha üle kanda",
    },
    picture: "/demo/story-demo-thumb-1.png",
    slides: [
      {
        id: randomId(),
        image: "/demo/story-1.png",
        align: "bottom",
        textBlocks: [
          {
            text: {
              en: "Expert opinion from Comcora",
              ru: "Мнение от эксперта Comcora",
              ee: "Eksperdi arvamus Comcorast",
            },
            primary: true,
          },
          {
            text: {
              en: "Evgeniy Shestov",
              ru: "Евгений Шестов",
              ee: "Evgeniy Šestov",
            },
            bold: true,
          },
        ],
        action: {
          type: "read",
          label: {
            en: "Learn more",
            ru: "Узнать больше",
            ee: "Loe lisaks",
          },
        },
      },
      {
        id: randomId(),
        image: "/demo/story-1.png",
        align: "bottom",
        textBlocks: [
          {
            text: {
              en: "Expert opinion from Comcora",
              ru: "Мнение от эксперта Comcora",
              ee: "Eksperdi arvamus Comcorast",
            },
            primary: true,
          },
          {
            text: {
              en: "How to earn from cryptocurrency",
              ru: "Как заработать на криптовалюте",
              ee: "Kuidas krüptovaluutast teenida",
            },
          },
          {
            text: {
              en: "Evgeniy Shestov",
              ru: "Евгений Шестов",
              ee: "Evgeniy Šestov",
            },
            bold: true,
          },
        ],
      },
      {
        id: randomId(),
        image: "/demo/story-1.png",
        align: "bottom",
        textBlocks: [
          {
            text: {
              en: "Expert opinion from Comcora",
              ru: "Мнение от эксперта Comcora",
              ee: "Eksperdi arvamus Comcorast",
            },
            primary: true,
          },
          {
            text: {
              en: "If your bank faces an insured event and you have questions, you can leave them in the 'Bankruptcy Hotline' section.",
              ru: "Если в отношении вашего банка наступил страховой случай и у вас появились вопросы, вы можете оставить их в разделе «Банкротство банков – Горячая линия».",
              ee: "Kui teie pank puutub kokku kindlustatud juhtumiga ja teil on küsimusi, saate need jätta jaotisse „Pankrotikuum liin”.",
            },
          },
          {
            text: {
              en: "Evgeniy Shestov",
              ru: "Евгений Шестов",
              ee: "Evgeniy Šestov",
            },
            bold: true,
          },
        ],
      },
    ],
    read: false,
  },
  {
    id: randomId(),
    title: {
      en: "Top news of Tallinn",
      ru: "Главные новости Таллина",
      ee: "Tallinna peamised uudised",
    },
    picture: "/demo/story-demo-thumb-3.png",
    read: false,
    slides: threeSlides,
  },
  {
    id: randomId(),
    title: {
      en: "Profitable mortgage for a new home",
      ru: "Выгодная ипотека на новый дом",
      ee: "Soodne hüpoteek uue kodu jaoks",
    },
    picture: "/demo/story-demo-thumb-2.png",
    read: false,
    slides: [threeSlides[1]!],
  },
  {
    id: randomId(),
    title: {
      en: "Fast Loans",
      ru: "Быстрые кредиты",
      ee: "Kiirlaenud",
    },
    picture: "/demo/story-demo-thumb-4.png",
    read: true,
    slides: [threeSlides[2]!],
  },
];

export const getLocalizedStories = (
  stories: Story[],
  language: string
): Story[] => {
  return stories.map((story) => ({
    ...story,
    title:
      typeof story.title === "string"
        ? story.title
        : story.title[language as keyof typeof story.title],
    slides: story.slides.map((slide) => ({
      ...slide,
      textBlocks: slide.textBlocks.map((block) => ({
        ...block,
        text:
          typeof block.text === "string"
            ? block.text
            : block.text[language as keyof typeof story.title],
      })),
      action: slide.action
        ? {
            ...slide.action,
            label:
              typeof slide.action.label === "string"
                ? slide.action.label
                : slide.action.label[language as keyof typeof story.title],
          }
        : undefined,
    })),
  }));
};

type StoryContextType = {
  stories: Story[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
};

const StoryContext = createContext<StoryContextType>({
  stories: [],
  currentIndex: 0,
  setCurrentIndex: () => void 0,
  currentSlideIndex: 0,
  setCurrentSlideIndex: () => void 0,
});

export const StoryProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { data: storiesData, isLoading } = api.story.stories.useQuery({
    publishingDateStart: new Date(2025, 0, 1).toISOString().slice(0, -5), // TODO: Business logic
  });

  const stories = useMemo<Story[]>(() => {
    if (!storiesData) {
      return [];
    }

    return storiesData.map((story: StoryViewDTO) => ({
      id: story.id,
      title: story.title,
      picture: story.coverUrl,
      read: false,
      slides: story.rolls.map((roll) => {
        const slide: Slide = {
          id: roll.id,
          image: roll.pictureUrl,
          textBlocks: [{ text: roll.title, primary: true }],
          align: "top",
        };

        if (roll.subtitle) {
          slide.textBlocks.push({ text: roll.subtitle });
        }
        if (roll.text) {
          slide.textBlocks.push({ text: roll.text });
        }
        if (roll.buttonUrl) {
          slide.action = {
            label: "Читать статью",
            type: "link",
            data: { url: roll.buttonUrl },
          };
        }

        return slide;
      }),
    })) as Story[];
  }, [storiesData]);

  return (
    <StoryContext.Provider
      value={{
        stories: stories.concat(storiesMock),
        currentIndex,
        setCurrentIndex,
        currentSlideIndex,
        setCurrentSlideIndex,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => useContext(StoryContext);
