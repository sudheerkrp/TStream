import PostStream from "@/components/forms/PostStream";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () =>{
    const user = await currentUser();
    if (!user)
        redirect("/sign-in");
    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded)
        redirect("/onboarding");
    return (
        <>
            <h1 className="head-text">Create Stream</h1>
            <PostStream userId={userInfo._id} />
        </>
    );
}

export default Page;