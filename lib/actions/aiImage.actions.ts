"use server";

import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { connectToDB } from "../mongoose";

export async function fetchPosts() {
  connectToDB();

  
}