import { NextResponse, type NextRequest } from "next/server";
import { session } from "@/server/session";
import { GATEWAY_API_HOST } from "@/server/trpc/config";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  const sessionData = session();
  const accessToken = await sessionData.get("accessToken");
  if (!accessToken) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const expectedEncryptedPin = await sessionData.get("encryptedAccessPin");
  const actualEncryptedPin = request.headers.get("x-encrypted-pin");

  if (expectedEncryptedPin !== actualEncryptedPin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const formData = await request.formData();
  const imageFile = formData.get("image");
  if (!imageFile) {
    return NextResponse.json(null, { status: 400 });
  }
  const imageBuffer = Buffer.from(
    await (
      imageFile as { arrayBuffer: () => Promise<ArrayBuffer> }
    ).arrayBuffer()
  );

  const editedImageBuffer = await sharp(imageBuffer)
    .resize({ height: 256, width: 256, fit: "cover" })
    .toBuffer();

  const bodyFormData = new FormData();

  bodyFormData.append("photo", new Blob([editedImageBuffer]));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = await axios.post(
    GATEWAY_API_HOST + "/api/v1/profile/picture",
    bodyFormData,
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  );

  return NextResponse.json({ success: true });
}

// Export types for API Routes
export type UploadProfileImageResponse = ExtractGenericFromNextResponse<
  Awaited<ReturnType<typeof POST>>
>;
type ExtractGenericFromNextResponse<Type> =
  Type extends NextResponse<infer X> ? X : never;
