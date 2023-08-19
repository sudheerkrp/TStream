import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { communityTabs } from "@/constants";
import ProfileHeader from "@/components/shared/ProfileHeader";
import StreamsTab from "@/components/shared/StreamsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";
import { redirect } from "next/navigation";

const Page = async ({ params }: {params: {id: string}}) => {
    const user = await currentUser();
    if (!user)
        redirect("/sign-in");
    const communityDetails = await fetchCommunityDetails(params.id);
    return (
        <section>
            <ProfileHeader accountId={communityDetails.id} authUserId={user.id} name={communityDetails.name} username={communityDetails.username} imgUrl={communityDetails.image} bio={communityDetails.bio} type="Community"/>
            <div className="mt-9">
                <Tabs defaultValue="streams" className="w-full">
                    <TabsList className="tab">
                        {communityTabs.map((tab) =>(
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image src={tab.icon} alt={tab.label} height={24} width={24} className="object-contain"/>
                                <p className="max-sm:hidden">{tab.label}</p>
                                {tab.label === "Streams" && (
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                        {communityDetails?.streams?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="streams" className="w-full text-light-1">
                            <StreamsTab currentUserId={user.id} accountId={communityDetails._id} accountType="Community"/>
                    </TabsContent>
                    <TabsContent value="members" className="w-full text-light-1">
                        <section className="mt-9 flex flex-col gap-10">
                            {communityDetails.members.map((member: any) =>(
                                <UserCard key={member.id} id={member.id} name={member.name} username={member.username} imageUrl={member.image} personType="User"/>
                            ))}
                        </section>
                    </TabsContent>
                    <TabsContent value="requests" className="w-full text-light-1">
                            <StreamsTab currentUserId={user.id} accountId={communityDetails._id} accountType="Community"/>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}

export default Page;