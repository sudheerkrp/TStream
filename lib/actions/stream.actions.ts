"use server"
import { revalidatePath } from "next/cache";
import Stream from "../models/stream.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createStream({text, author, communityId, path}: Params)
{
    connectToDB();
    try
    {
        const createStream = await Stream.create({text, author, community: null});

        await User.findByIdAndUpdate(author, {
            $push: {streams: createStream._id}
        } );
        revalidatePath(path);
    }
    catch(err: any)
    {
        throw new Error(`Failed to create stream ${err.message}`);
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20)
{
    connectToDB();
    try
    {
        const skipAmount = (pageNumber - 1)*pageSize;
        const postsQuery = Stream.find({parentId: {$in: [null, undefined]}}).sort({createdAt: "desc"}).skip(skipAmount).limit(pageSize).populate({path: "author", model: User}).populate({path: "children", populate: {path: "author", model: User, select: "_id name parentId image"}});

        const totalPostsCount = await Stream.countDocuments({parentId: {$in: [null, undefined]}});

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;
        return  {posts, isNext};
    }
    catch(err: any)
    {
        throw new Error(`Failed to fetch streams ${err.message}`);
    }
}

export async function fetchStreamById(id: string)
{
    connectToDB();
    try
    {
        // To-Do: Populate Community
        const stream = await Stream.findById(id).populate({path: "author", model: User, select: "_id id name image"}).populate({path: "children", populate: [
            {path: "author", model: User, select: "_id id name parentId image"}, {path: "children", model: Stream, populate: {
                path: "author", model: User, select: "_id id name parentId image"
            }}
        ]}).exec();
        return stream;
    }
    catch(err: any)
    {
        throw new Error(`Failed to fetch stream ${err.message}`);
    }
}

