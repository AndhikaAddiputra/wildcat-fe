"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { LogIn, LogOut } from "lucide-react";
import type { NavLink } from "@/components/ui/navbar";

const LOGO = (
  <img src="/wildcat-logo.svg" alt="Wildcat" className="h-14 w-auto" />
);

/** 1. Navbar Landing: About, Competition, Event, Timeline + Login */
export const LANDING_NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Competition", href: "#competitions" },
  { label: "Event", href: "#events" },
  { label: "Timeline", href: "#timeline" },
];

export const LANDING_NAV_ACTION = (
  <Link href="/login">
    <Button variant="outline" size="lg">
      <LogIn className="h-4 w-4" />
      Login
    </Button>
  </Link>
);

/** 2. Navbar Participant: ParticipantHome, Team, Administration, ParticipantEvents, Submission + Logout */
export const PARTICIPANT_NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/home" },
  { label: "Team", href: "/teams" },
  { label: "Administration", href: "/administration" },
  { label: "Events", href: "/events" },
  { label: "Submission", href: "/submission" },
];

export const PARTICIPANT_NAV_ACTION = (
  <Link href="/landing">
    <Button variant="outline" size="lg">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  </Link>
);

/** 3. Navbar Committee: CommitteeHome, Verification, CommitteeSubmission (placeholder) + Logout */
export const COMMITTEE_NAV_LINKS: NavLink[] = [
  { label: "CommitteeHome", href: "/committee" },
  { label: "Verification", href: "/committee/verification" },
  { label: "CommitteeSubmission", href: "/committee/submission" },
];

export const COMMITTEE_NAV_ACTION = (
  <Link href="/landing">
    <Button variant="outline" size="lg">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  </Link>
);

/** 4. Navbar Admin: AdminHome, AccessControl, Announcement (placeholder) + Logout */
export const ADMIN_NAV_LINKS: NavLink[] = [
  { label: "AdminHome", href: "/admin" },
  { label: "AccessControl", href: "/admin/access-control" },
  { label: "Announcement", href: "/admin/announcement" },
];

export const ADMIN_NAV_ACTION = (
  <Link href="/landing">
    <Button variant="outline" size="lg">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  </Link>
);

export { LOGO };
