"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { connectToDB } from "../mongoose"; 
import AiImage from "../models/aiImage.model";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
export async function fetchAllAIImages() {
  try
  {
    connectToDB();
    const allAIImages = await AiImage.find({});
    return allAIImages;
  }
  catch (err)
  {
    console.error("Error while fetching AI images:", err);
    throw new Error("Unable to fetch AI images.");
  } 
}

export async function saveAIImage({name, prompt, cloudinaryUrl}: any) {
  try
  {
    connectToDB();
    const newAIImage = await AiImage.create({name, prompt, photo: cloudinaryUrl});
    await newAIImage.save();
    return true;
  }
  catch (err)
  {
    console.error("Error while saving AI image:", err);
    throw new Error("Unable to save AI image.");
  } 
}