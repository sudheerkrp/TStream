import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import StreamCard from "../cards/StreamCard";

interface Props {
    currentUserId: string;
    accountId: string; 
    accountType: string;
}
const StreamsTab = async ({currentUserId, accountId, accountType}: Props) => {
    const result = await fetchUserPosts(accountId);
    if(!result) 
        redirect("/");
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.streams.map((stream: any) =>(
                <StreamCard key={stream._id} id={stream._id} currentUserId={currentUserId} parentId={stream.parentId} content={stream.text} author={accountType === "User"?{name: result.name, image: result.image, id: result.id}:{name: stream.author.name, image: stream.author.image, id: stream.author.id}} community={stream.community} createdAt={stream.createdAt} comments={stream.children} />            ))}
        </section>
    );
}

export default StreamsTab;