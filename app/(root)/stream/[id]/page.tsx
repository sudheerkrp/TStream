import StreamCard from "@/components/cards/StreamCard";
import { fetchStreamById } from "@/lib/actions/stream.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: {id: string}}) => {

    const user = await currentUser();
    if(!user)
        redirect("/sign-in");
    if(!params.id)
        return null;
    const userInfo = await fetchUser(user.id);
    if(!userInfo.onboarded)
        redirect("/onboarding");
    const stream = await fetchStreamById(params.id);

    return (
        <section className="relative">
            <div>
            <StreamCard key={stream._id} id={stream._id} currentUserId={user?.id || ""} parentId={stream.parentId} content={stream.text} author={stream.author} community={stream.community} createdAt={stream.createdAt} comments={stream.children}/>
            </div>
        </section>
    );
}

export default Page;