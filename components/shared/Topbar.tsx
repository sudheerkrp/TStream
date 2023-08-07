"use client"
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useRouter } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
function Topbar()
{
    const router = useRouter();

    return (
        <nav className="topbar">
            <Link href="/" className="flex ite gap-4">
                <Image src="/assets/logo.svg" alt="Logo" width={28} height={28}/>
                <p className="text-heading3-bold text-light-1 max-xs:hidden">TStream</p>
            </Link>
            <div className="flex items-center gap-1">
                <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                            <div className="flex cursor-pointer">
                                <Image src="/assets/logout.svg" alt="Logout" height={24} width={24} />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>
                <OrganizationSwitcher appearance={{ baseTheme: dark, elements: {organizationSwitcherTrigger: "py-2 px-4"}}}/>
            </div>
        </nav>
    );
}

export default Topbar;