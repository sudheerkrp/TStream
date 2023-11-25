import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import UserCard from "@/components/cards/UserCard";
import SearchBar from "@/components/shared/SearchBar";
import Pagination from "@/components/shared/Pagination";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";

const Page = async ({
    searchParams,
  }: {
    searchParams: { [key: string]: string | undefined };
  }) => {

    const user = await currentUser();
    if (!user)
        redirect("/sign-in");
    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded)
        redirect("/onboarding");
    const result = await fetchUsers({
        userId: user.id,
        searchString: searchParams.q,
        pageNumber: searchParams?.page ? +searchParams.page : 1,
        pageSize: 25,
      });
    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>
            <SearchBar routeType='search' />
            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0  ? (
                    <p className="no-result">No Results</p>
                ):(
                    <>
                        {result.users.map((person) => (
                            <UserCard key={person.id} id={person.id} name={person.name} username={person.username} imageUrl={person.image} personType="User"/>
                        ))}
                    </>
                )}
            </div>

            <Pagination
        path='search'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
        </section>
    );
}

export default Page;