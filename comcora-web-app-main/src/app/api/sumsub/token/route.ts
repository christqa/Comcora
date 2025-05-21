import crypto from "crypto";
import { NextResponse, type NextRequest } from "next/server";

const APP_TOKEN =
  "sbx:SVvUj5sQsAveoNEH18qrplhN.zZidH4wXc4TedwtPjXmsqnaeqaLY6iZQ"; // Replace with your app token
const SECRET_KEY = "4y4oxb7Ex94epBqeH0aB04rZ7gAdbnHZ"; // Replace with your secret key

export async function POST(req: NextRequest) {
  try {
    const { userId, levelName } = await req.json();

    if (!userId || !levelName) {
      return NextResponse.json(
        { error: "Missing userId or levelName" },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const httpMethod = "POST";
    const requestUri = "/resources/accessTokens/sdk";
    const requestBody = JSON.stringify({ userId, levelName });

    // 🔥 Correct signature generation
    const stringToSign = `${timestamp}${httpMethod}${requestUri}${requestBody}`;
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(stringToSign)
      .digest("hex");

    const response = await fetch(`https://api.sumsub.com${requestUri}`, {
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
        "X-App-Token": APP_TOKEN,
        "X-App-Access-Sig": signature,
        "X-App-Access-Ts": timestamp.toString(),
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ token: data.token });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
