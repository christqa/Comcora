import { STORIES_GATEWAY_API_HOST } from "@/server/trpc/config";
import {
  createTRPCRouter,
  twoLevelsProtectedProcedure,
} from "@/server/trpc/trpc";
import { storyApiControllers } from "@xdatagroup/tbb-sdk";
import { z } from "zod";

const StoryState = z.enum(["NEW", "DRAFT", "PREPARED", "PUBLISHED"]);
const StoryPeriod = z.enum([
  "DAY",
  "WEEK",
  "WEEKEND",
  "FORTNIGHT",
  "MONTH",
  "CUSTOM",
]);
const StoryActivePeriod = z.enum(["DAY", "WEEK", "WEEKEND", "CUSTOM"]);
const StoryTargetAudience = z.enum(["PRIVATE", "BUSINESS", "CUSTOM"]);

const StoriesApiArg = z.object({
  state: z.array(StoryState).optional(),
  period: z.array(StoryPeriod).optional(),
  activePeriod: z.array(StoryActivePeriod).optional(),
  targetAudience: StoryTargetAudience.optional(),
  publishingDateStart: z.string().optional(),
  publishingDateEnd: z.string().optional(),
  storyCount: z.number().optional(),
});

export const storyRouter = createTRPCRouter({
  stories: twoLevelsProtectedProcedure.input(StoriesApiArg).query(({ ctx }) => {
    return storyApiControllers.storiesApp.stories1(
      ctx.httpClient,
      { state: ["PUBLISHED", "NEW"], storyCount: 10 },
      {
        baseURL: STORIES_GATEWAY_API_HOST,
      }
    );
  }),
});
