"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Stream from "../models/stream.model";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({userId, username, name, bio, image, path}: Params): Promise<void> {
    connectToDB();

    try 
    {
        await User.findOneAndUpdate({ id: userId }, { username: username.toLowerCase(), name, bio, image, onboarded: true }, { upsert: true });

        if (path === "/profile/edit") 
        {
            revalidatePath(path);
        }
    }
    catch (err: any) 
    {
        throw new Error(`Failed to create/update user ${err.message}`);
    }
}

export async function fetchUser(userId: string){
    try 
    {
        connectToDB();
        return await User.findOne({ id: userId })
        // .populate({path: "communities", model: Community});
    }
    catch (err: any)
    {
        throw new Error(`Failed to fetch user ${err.message}`);
    }
}

export async function fetchUserPosts(userId: string){
    try 
    {
        connectToDB();
         // .populate({path: "communities", model: Community});
        const streams = await User.findOne({ id: userId }).populate({path: "streams", model: Stream, populate: {
            path: "children", model: Stream, populate: {path: "author", model: User, select: "name image id"}}});

        return streams;
    }
    catch (err: any)
    {
        throw new Error(`Failed to fetch user posts ${err.message}`);
    }
}