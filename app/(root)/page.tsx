import StreamCard from "@/components/cards/StreamCard";
import { fetchPosts } from "@/lib/actions/stream.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {

  const user = await currentUser();
  if (!user)
      redirect("/sign-in");
  const result = await fetchPosts(1, 30);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {(result.posts.length === 0)?(
          <p className="no-results">No stream found.</p>
        ):(
          <>
            {result.posts.map((post) => (
              <StreamCard key={post._id} id={post._id} currentUserId={user?.id || ""} parentId={post.parentId} content={post.text} author={post.author} community={post.community} createdAt={post.createdAt} comments={post.children}/>
            ))}
          </>
        )}
      </section>
    </>
  )
}