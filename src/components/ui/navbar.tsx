"use client";

import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  logo?: ReactNode;
  links?: NavLink[];
  activeLink?: string;
  action?: ReactNode;
  /** Optional: custom content for mobile menu bottom (e.g. Login button). If not set, renders a default "Login" button. */
  mobileAction?: ReactNode;
  className?: string;
}

function Navbar({
  logo,
  links = [],
  activeLink,
  action,
  mobileAction,
  className,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 z-50 w-full transition-all duration-300",
          mounted && scrolled ? "bg-[#0A2D6E] md:shadow-md" : "bg-[#0A2D6E] md:bg-transparent",
          className
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <div className="flex shrink-0 items-center">{logo}</div>

          {/* Desktop: Nav Links */}
          <div className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeLink === link.href
                    ? "text-[#F6911E]"
                    : "text-[#f1e1b4]/90 hover:text-[#f1e1b4]"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop: Action */}
          <div className="hidden items-center md:flex">{action}</div>

          {/* Mobile: Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center text-[#f1e1b4] md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-[#0A2D6E] transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {/* Add extra bottom padding so login/action area isn't covered by ContactFAB */}
        <div className="flex h-full flex-col pt-24 pb-24">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center text-[#F6911E] hover:opacity-90"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Links */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-lg font-medium transition-colors",
                  activeLink === link.href
                    ? "text-[#F6911E]"
                    : "text-[#384288] hover:opacity-80"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Login / Action area */}
          <div className="mt-auto w-full px-6 [&_a]:block [&_a]:w-full [&_button]:w-full">
            {mobileAction ?? (
              <a
                href="#"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center rounded-2xl bg-[#F6911E] px-6 py-4 text-lg font-semibold text-white transition-opacity hover:opacity-90"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export { Navbar };
