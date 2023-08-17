"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Stream from "../models/stream.model";
import { FilterQuery, SortOrder } from "mongoose";

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

export async function fetchUsers({userId, searchString = "", pageNumber = 1,pageSize = 20, sortBy = "desc"}: {userId: string, searchString?: string, pageNumber?: number, pageSize?: number, sortBy?: SortOrder}){
    try 
    {
        connectToDB();
        
        const skipAmount = (pageNumber-1)*pageSize;
        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
            id: {$ne : userId}
        }
        if(searchString.trim() !== "")
        {
            query.$or = [
                {username: {$regex : regex}}, {name: {$regex : regex}}
            ];
        }

        const sortOptions = {createdAt: sortBy};
        const userQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await userQuery.exec();
        const isNext = (totalUsersCount > skipAmount + users.length);
        return {users, isNext};
    }
    catch (err: any)
    {
        throw new Error(`Failed to fetch users ${err.message}`);
    }
}

export async function getActivity(userId: string){
    try 
    {
        connectToDB();
        
        const userStreams = await Stream.find({author: userId});

        const childStreamIds = userStreams.reduce((acc, userStream) => {
            return acc.concat(userStream.children); // acc -> accumulator
        }, []); // [] -> default accumulator

        const replies = await Stream.find({_id: {$in: childStreamIds}, author: {$ne: userId}}).populate({path: "author", model: User, select: "name image _id"});
        return replies;
    }
    catch (err: any)
    {
        throw new Error(`Failed to fetch activity ${err.message}`);
    }
}