"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import OpenAI from "openai";
import AiImage from "../models/aiImage.model";
import { connectToDB } from "../mongoose";

const openai = new OpenAI();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

export async function generateAIImage(prompt: string) {
    try {
        const aiResponse = await openai.images.generate({prompt, n: 1, size: '1024x1024', response_format: 'b64_json'});
        const image = aiResponse.data[0].b64_json;
        const photoUrl = await cloudinary.uploader.upload(`data:image/jpeg;base64,${image}`);
        // connectToDB();
        // const newAIImage = await AiImage.create({name, prompt, photo: photoUrl.url});
        // await newAIImage.save();
        return {image: image, url: photoUrl.url};
    } catch (err) {
      console.error("Error while generating AI image:", err);
      throw new Error("Unable to generate AI image.");
    }
  }
