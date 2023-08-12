import StreamCard from "@/components/cards/StreamCard";
import Comment from "@/components/forms/Comment";
import { fetchStreamById } from "@/lib/actions/stream.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {

    const user = await currentUser();
    if (!user)
        redirect("/sign-in");
    if (!params.id)
        return null;
    const userInfo = await fetchUser(user.id);
    if (!userInfo.onboarded)
        redirect("/onboarding");
    const stream = await fetchStreamById(params.id);

    return (
        <section className="relative">
            <div>
                <StreamCard key={stream._id} id={stream._id} currentUserId={user?.id || ""} parentId={stream.parentId} content={stream.text} author={stream.author} community={stream.community} createdAt={stream.createdAt} comments={stream.children} />
            </div>
            <div className="mt-7">
                <Comment streamId={stream.id} currentUserImg={userInfo.image} currentUserId={JSON.stringify(userInfo._id)} />
            </div>
            <div className="mt-10">
                {stream.children.map((childItem: any) => (
                    <StreamCard key={childItem._id} id={childItem._id} currentUserId={childItem?.id || ""} parentId={childItem.parentId} content={childItem.text} author={stream.author} community={childItem.community} createdAt={childItem.createdAt} comments={childItem.children} isComment />
                ))}
            </div>
        </section>
    );
}

export default Page;