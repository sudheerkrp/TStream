"use client"

import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

function Bottombar()
{
    const pathname = usePathname();
    const { userId } = useAuth();

    return (
        <section className="bottombar">
            <div className="bottombar_container">
            {sidebarLinks.map(link => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                    if(link.route === "/profile")
                        link.route = `${link.route}/${userId}`;
                    return (
                        <div key={link.label}>
                            <Link href={link.route} className={`bottombar_link ${isActive && 'bg-primary-500'}`}>
                                <Image src={link.imgURL} alt={link.label} height={24} width={24} />
                                <p className="text-subtle-medium text-light-1 max-sm:hidden">{link.label.split(/\s+/)[0]}</p>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </section>
    );
}

export default Bottombar;