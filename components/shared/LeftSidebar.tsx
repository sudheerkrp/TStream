"use client"
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";

function LeftSidebar() {
    const { userId } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map(link => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                    if(link.route === "/profile")
                        link.route = `${link.route}/${userId}`;
                    return (
                        <div key={link.label}>
                            <Link href={link.route} className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}>
                                <Image src={link.imgURL} alt={link.label} height={24} width={24} />
                                <p className="text-light-1 max-lg:hidden">{link.label}</p>
                            </Link>
                        </div>
                    )
                })}
            </div>
            <div className="mt-10 px-6">
                <div className="flex items-center gap-1">
                    <SignedIn>
                        <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                            <div className="flex cursor-pointer gap-4 p-4">
                                <Image src="/assets/logout.svg" alt="Logout" height={24} width={24} />
                                <p className="text-light-2 max-lg:hidden">Logout</p>
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>
            </div>
        </section>
    );
}

export default LeftSidebar;