import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <>
      <h1 className='head-text'>Edit Profile</h1>
      <div className='mt-3'>
        <span className='text-base-regular text-light-2'>Make any changes</span>
        <span className="text-sm">
          <span className="text-light-2">&nbsp;(Don't have suitable profile photo? Ask our AI Assistant&nbsp;</span>
          <a className="text-[#0000FF]" href="/ai-img-gen">AI-Img-Gen</a>
          <span className="text-light-2">&nbsp; to generate image for you.)</span>
        </span>
      </div>
      <section className='mt-12'>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </>
  );
}

export default Page;
