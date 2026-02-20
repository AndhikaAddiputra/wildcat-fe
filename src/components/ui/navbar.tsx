import { Button } from "./button";
import Image from "next/image";
import { Settings, Bell, Zap } from "lucide-react";

function Navbar(){
    return (
        <header className="border-b border-zinc-200 bg-[#0b2e6f] dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <Image src="/wildcat-logo.svg" alt="Wildcat" width={64} height={64} className="drop-shadow-lg drop-shadow-white" />
                </div>
                <nav className="hidden items-center gap-6 md:flex text-white dark:text-white text-[20px]">
                    <a href="#components" className="hover:text-[#f79321] dark:hover:[#f79321] active:text-[#f79321]">
                      Home
                    </a>
                    <a href="#icons" className="hover:text-[#f79321] dark:hover:text-[#f79321] active:text-[#f79321]">
                      Team
                    </a>
                    <a href="#forms" className="hover:text-[#f79321] dark:hover:text-[#f79321] active:text-[#f79321]">
                      Administration
                    </a>
                    <a href="#forms" className="hover:text-[#f79321] dark:hover:text-[#f79321] active:text-[#f79321]">
                      Events
                    </a>
                    <a href="#forms" className="hover:text-[#f79321] dark:hover:text-[#f79321] active:text-[#f79321]">
                      Submission
                    </a>
                </nav>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Logout</Button>
                </div>
            </div>
        </header>
    );
}

export { Navbar };
