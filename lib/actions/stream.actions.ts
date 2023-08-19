"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Stream from "../models/stream.model";
import Community from "../models/community.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level streams) (a stream that is not a comment/reply).
  const postsQuery = Stream.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (streams) i.e., streams that are not comments.
  const totalPostsCount = await Stream.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createStream({ text, author, communityId, path }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdStream = await Stream.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { streams: createdStream._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { streams: createdStream._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create stream: ${error.message}`);
  }
}

async function fetchAllChildStreams(streamId: string): Promise<any[]> {
  const childStreams = await Stream.find({ parentId: streamId });

  const descendantStreams = [];
  for (const childStream of childStreams) {
    const descendants = await fetchAllChildStreams(childStream._id);
    descendantStreams.push(childStream, ...descendants);
  }

  return descendantStreams;
}

export async function deleteStream(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the stream to be deleted (the main stream)
    const mainStream = await Stream.findById(id).populate("author community");

    if (!mainStream) {
      throw new Error("Stream not found");
    }

    // Fetch all child streams and their descendants recursively
    const descendantStreams = await fetchAllChildStreams(id);

    // Get all descendant stream IDs including the main stream ID and child stream IDs
    const descendantStreamIds = [
      id,
      ...descendantStreams.map((stream) => stream._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantStreams.map((stream) => stream.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainStream.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantStreams.map((stream) => stream.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainStream.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child streams and their descendants
    await Stream.deleteMany({ _id: { $in: descendantStreamIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { streams: { $in: descendantStreamIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { streams: { $in: descendantStreamIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete stream: ${error.message}`);
  }
}

export async function fetchStreamById(streamId: string) {
  connectToDB();

  try {
    const stream = await Stream.findById(streamId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Stream, // The model of the nested children (assuming it's the same "Stream" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return stream;
  } catch (err) {
    console.error("Error while fetching stream:", err);
    throw new Error("Unable to fetch stream");
  }
}

export async function addCommentToStream(
  streamId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original stream by its ID
    const originalStream = await Stream.findById(streamId);

    if (!originalStream) {
      throw new Error("Stream not found");
    }

    // Create the new comment stream
    const commentStream = new Stream({
      text: commentText,
      author: userId,
      parentId: streamId, // Set the parentId to the original stream's ID
    });

    // Save the comment stream to the database
    const savedCommentStream = await commentStream.save();

    // Add the comment stream's ID to the original stream's children array
    originalStream.children.push(savedCommentStream._id);

    // Save the updated original stream to the database
    await originalStream.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}