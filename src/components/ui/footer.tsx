import { cn } from "@/lib/utils";
import { Linkedin, Mail, Instagram } from "lucide-react";

export interface FooterProps {
  className?: string;
}

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/aapgitbsc/posts/?feedView=all", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
  { icon: Instagram, href: "https://www.instagram.com/wildcataapgitb/", label: "Instagram" },
];

function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("w-full", className)}>
      <div className="bg-[#F1E1B4] px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <img
              src="/wildcat-text-logo.svg"
              alt="Wildcat"
              className="mb-5 h-16 w-auto"
            />
            <p className="text-sm leading-relaxed text-zinc-700">
              AAPG SC ITB 2026 presents the premier international petroleum
              geoscience competition. Leading Petroleum Geoscience to Fuel the
              Future of Oil and Gas.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <h4 className="mb-4 text-sm font-bold tracking-wide text-[#0A2D6E]">
              CONNECT WITH US
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0A2D6E] text-[#F6911E] transition-opacity hover:opacity-80"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F6911E] px-6 py-4">
        <p className="text-center text-sm font-medium text-white">
          &copy; 2026 Wildcat by AAPG ITB SC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export { Footer };
