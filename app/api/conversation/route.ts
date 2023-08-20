import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY)
      return new NextResponse("Open AI API key not configures", {
        status: 500,
      });

    if (!messages)
      return new NextResponse("Messages are required", { status: 400 });

    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    return NextResponse.json(res.choices[0].message);
  } catch (err) {
    console.error("CONVERSATION_ERROR", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
