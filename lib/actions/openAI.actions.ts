"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateAIImage(prompt: string) {
    try {
        const aiResponse = await openai.createImage({prompt: prompt, n: 1, size: "1024x1024", response_format: "b64_json"});

        const image = aiResponse.data.data[0].b64_json;
        return image;
    } catch (err) {
      console.error("Error while generating AI image:", err);
      throw new Error("Unable to generate AI image.");
    }
  }
