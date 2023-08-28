import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {

  const user = await currentUser();
  if (!user)
      redirect("/sign-in");

  return (
    <h1>Generate Image</h1>
  );
}