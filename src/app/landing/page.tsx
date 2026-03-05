"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Navbar,
  Footer,
  CompetitionCard,
  TimelineItem,
} from "@/components/ui";
import {
  LOGO,
  LANDING_NAV_LINKS,
  LANDING_NAV_ACTION,
} from "@/config/navbar-config";
import {
  FileText,
  Briefcase,
  FlaskConical,
  GraduationCap,
  Heart,
  LogIn,
  Mic,
  CalendarDays,
  Trophy,
  Award,
  ArrowRight,
} from "lucide-react";

const SECTION_IDS = ["#about", "#competitions", "#events", "#timeline"] as const;

/** Timeline item for competition modals (label + date string) */
type ModalTimelineItem = { label: string; date: string };

/**
 * Mengambil tanggal awal dari string tanggal (untuk perbandingan).
 * Format didukung: "14 - 21 March 2026", "22 March - 5 April 2026", "13 April 2026", "March 2026".
 */
function getStartDateFromTimelineDate(dateStr: string): Date | null {
  const s = dateStr.trim();
  const yearMatch = s.match(/\b(20\d{2})\b/);
  const year = yearMatch ? yearMatch[1] : String(new Date().getFullYear());
  if (s.includes(" - ")) {
    const [left, right] = s.split(" - ").map((x) => x.trim());
    const startPart = left;
    if (/^\d{1,2}\s+\w+/.test(startPart)) {
      const parsed = new Date(`${startPart} ${year}`);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const endPart = right;
    const monthYear = endPart.replace(/^\d{1,2}\s*/, "").trim();
    const firstNum = left.match(/^\d{1,2}/);
    const start = firstNum ? `${firstNum[0]} ${monthYear}` : `${monthYear}`;
    const parsed = new Date(start);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (/^\d{1,2}\s+\w+\s+\d{4}$/.test(s)) {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const monthYear = s.match(/^([A-Za-z]+)\s*(\d{4})?$/);
  if (monthYear) {
    const month = monthYear[1];
    const y = monthYear[2] || year;
    const d = new Date(`1 ${month} ${y}`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/** True jika tanggal hari ini sudah mencapai atau melewati tanggal mulai dari dateStr. */
function isTimelineDateReached(dateStr: string): boolean {
  const start = getStartDateFromTimelineDate(dateStr);
  if (!start) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return today.getTime() >= start.getTime();
}

/** Data tiap kompetisi untuk card + modal variant competition */
const COMPETITIONS = [
  {
    id: "paper-poster",
    title: "Paper & Poster Competition",
    description:
      "This competition is a manifestation platform of the Technology pillar for students to present real ideas and solutions through the development of geoscience technology, focusing on validating innovations that can expand the boundaries of oil and gas exploration.",
    timeline: [
      { label: "Early Registration", date: "13 - 22 March 2026" },
      { label: "Normal Registration", date: "23 - 31 Maret 2026" },
      { label: "Abstract Submission", date: "7 April 2026" },
      { label: "Finalist Announcement", date: "25 April 2026" },
      { label: "Final Technical Meeting I", date: "2 May 2026" },
      { label: "Full Paper & Poster Submission", date: "12 May 2026" },
      { label: "Final Technical Meeting II", date: "12 June 2026" },
      { label: "Final Pitching Day", date: "20 - 21 June 2026" },
    ] as ModalTimelineItem[],
    imageUrl: "/PaPos.png",
  },
  {
    id: "business-case",
    title: "Business Case Competition",
    description:
      "An event for students to solve real business challenges in the energy sector, requiring participants to develop strategies that integrate profitability, ethics, and sustainability (Responsibility and Market Competition) in the industry.",
    timeline: [
      { label: "Early Registration", date: "14 - 21 March 2026" },
      { label: "Normal Registration", date: "22 March - 5 April 2026" },
      { label: "Preliminary Case Release", date: "13 April 2026" },
      { label: "Preliminary Case Submission", date: "11 May 2026" },
      { label: "Finalist Announcement", date: "21 May 2026" },
      { label: "Mentoring 1 on 1 Session", date: "23 May 2026" },
      { label: "Final Case Submission", date: "12 June 2026" },
      { label: "Final Technical Meeting", date: "14 June 2026" },
      { label: "Final Pitching Day", date: "20 - 21 June 2026" },
    ] as ModalTimelineItem[],
    imageUrl: "/BCC.png",
  },
  {
    id: "gng-case",
    title: "GnG Case Study Competition",
    description:
      "A high-level technical competition embodying the pillars of Science and Technology, testing participants' ability to integrate geological and geophysical data to comprehensively solve exploration or field development challenges.",
    timeline: [
      { label: "Early Registration", date: "14 -21 March 2026" },
      { label: "Normal Registration", date: "22 March - 5 April 2026" },
      { label: "Prelimanary Case Release", date: "13 April 2026" },
      { label: "Prelimanary Case Submission", date: "11 May 2026" },
      { label: "Finalist Announcement", date: "21 May 2026" },
      { label: "Final Case Release & Software Training", date: "23 May 2026"},
      { label: "Final Case Submission", date: "12 June 2026" },
      { label: "Final Technical Meeting", date: "14 June 2026" },
      { label: "Final Pitching Day", date: "20 - 21 June 2026" },
    ] as ModalTimelineItem[],
    imageUrl: "/GnG%20Case%20Study.png",
  },
  {
    id: "high-school-essay",
    title: "High School Essay Competition",
    description:
      "This science literacy competition, open to high school students and equivalents, aims to spark critical thinking among young people about the role of energy, the world of geoscience, and how future innovations can ensure global energy security.",
    timeline: [
      { label: "Early Registration", date: "13 - 22 March 2026" },
      { label: "Normal Registration", date: "23March - 10 April 2026" },
      { label: "Essay Submission", date: "20 May 2026" },
      { label: "Finalist Announcement", date: "24 May 2026" },
      { label: "Final Technical Meeting", date: "19 June 2026" },
      { label: "Final Competition Day", date: "20 - 21 June 2026" },
    ] as ModalTimelineItem[],
    imageUrl: "/Essay.png",
  },
];

/** Status event: available (hijau), not_started (kuning), ended (merah) */
type EventStatus = "available" | "not_started" | "ended";

/** Data event untuk card + modal variant event */
const EVENTS = [
  {
    id: "wiact",
    title: "WiACT (Community Service)",
    description:
      "This side event is a social engagement activity with children, conducted in collaboration with a non-profit organization. It is designed to foster empathy and a sense of responsibility among participants while creating a positive and enjoyable experience for the children.",
    status: "not_started" as EventStatus,
    eventDate: "11 April 2026",
    eventPlace: "TBA",
    eventSpeaker: "Soon to be announced",
  },
  {
    id: "wishare",
    title: "WISHARE (Charity Program)",
    description:
      "This charity program aims to support selected beneficiaries through fundraising and donation activities conducted throughout the event series. It reflects the event's commitment to social contribution by encouraging meaningful actions with a direct impact on the community.",
    status: "not_started" as EventStatus,
    eventDate: "21 June 2026",
    eventPlace: "TBA",
    eventSpeaker: "Soon to be announced",
  },
  {
    id: "field-trip",
    title: "Field Trip",
    description:
      "The Field Trip is a collective outdoor activity where participants, including finalists, visit various geological sites to observe features firsthand. Expert speakers facilitate the trip to provide a comprehensive understanding of geological processes and their real-world applications.",
    status: "not_started" as EventStatus,
    eventDate: "22 June 2026",
    eventPlace: "TBA",
    eventSpeaker: "Soon to be announced",
  },
  {
    id: "webinar",
    title: "Webinar",
    description:
      "The webinar session invites professional speakers from the field of petroleum geoscience to share insights and current industry developments. This is designed to broaden participants' perspectives and deepen their understanding of real-world challenges and opportunities.",
    status: "not_started" as EventStatus,
    eventDate: "14 March 2026",
    eventPlace: "Online via Zoom Meeting",
    eventSpeaker: "Soon to be announced",
  },
  {
    id: "grand-seminar",
    title: "Grand Seminar",
    description:
      "Held during the final stage, the Grand Seminar features various academic and professional speakers in keynote talks and panel discussions. This session aims to enrich participants' knowledge, inspire critical thinking, and provide deeper insights related to petroleum geoscience.",
    status: "not_started" as EventStatus,
    eventDate: "21 June 2026",
    eventPlace: "TBA",
    eventSpeaker: "Soon to be announced",
  },
];

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("#about");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.querySelector(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(id);
          });
        },
        { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy text-white">
      {/* Navbar */}
      <Navbar
        logo={LOGO}
        links={LANDING_NAV_LINKS}
        activeLink={activeSection}
        action={LANDING_NAV_ACTION}
        mobileAction={LANDING_NAV_ACTION}
      />

      {/* ══════════════════════════════════════
          HERO SECTION
         ══════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background still */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/background-hero-still.svg')" }}
        />

        {/* Background move - rotating counter-clockwise */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/background-hero-move.svg"
            alt=""
            className="animate-spin-slow-reverse h-[140%] w-[140%] max-w-none object-contain opacity-60"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <img
            src="/Main-title.svg"
            alt="WILDCAT 2026"
            className="mb-8 h-auto w-full max-w-[min(90vw,520px)] sm:max-w-[min(85vw,640px)]"
          />
          <p className="mx-auto mb-10 max-w-xl text-base font-semibold leading-relaxed text-cream sm:text-2xl">
            Leading Petroleum Geoscience to Fuel the Future of Oil and Gas
          </p>
          <Button
            size="lg"
            variant="primary"
          >
            Register Now
          </Button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHAT IS WILDCAT?
         ══════════════════════════════════════ */}
      <section id="about" className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-extrabold text-navy sm:text-4xl">
            WHAT IS WILDCAT?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-navy/70 sm:text-base">
            Wildcat AAPG ITB 2026 is an annual Petroleum Geoscience-themed
            competition and industry engagement platform designed to simulate
            real subsurface workflows in oil and gas.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-navy bg-cream p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange">
                Our Vision
              </p>
              <h3 className="mb-3 text-xl font-bold text-navy">
                A Gateway to Excellence
              </h3>
              <p className="text-sm leading-relaxed text-navy/70">
                Providing a platform for cultivating globally-adept talent,
                progress, and sustainable petroleum excellence, we strive to
                uphold AAPG ITB 2026 as a pathway to excellence.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-navy bg-cream p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange">
                Our Think
              </p>
              <h3 className="mb-3 text-xl font-bold text-navy">
                Fueling the Future
              </h3>
              <p className="text-sm leading-relaxed text-navy/70">
                &ldquo;Wildcat Petroleum Geoscience fosters insight exchange of
                oil and gas; partnership, scientific impact and breakthroughs,
                alongside a greater sense of shared responsibility.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CHOOSE YOUR PATH!
         ══════════════════════════════════════ */}
      <section id="competitions" className="bg-lavender px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-extrabold text-navy sm:text-4xl">
            CHOOSE YOUR PATH!
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <CompetitionCard
              icon={<FileText className="h-6 w-6" />}
              title="Paper & Poster Competition"
              description="This competition is an international-class platform for bachelor/class students to present and communicate their scientific research in the petroleum geoscience field, while focusing on trending and innovative topics in oil and gas exploration."
            />
            <CompetitionCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Business Case Competition"
              description="An avenue for students in oil and gas business challenges in the energy sector, covering areas such as exploration, production, profitability, strategy, and sustainability-driven business planning."
            />
            <CompetitionCard
              icon={<FlaskConical className="h-6 w-6" />}
              title="GnG Case Study Competition"
              description="A high-level technical competition challenging the critical thinking of students through integrated, exciting geoscience cases study to enrich them with data-driven analysis, problem-solving, and collaboration skills."
            />
            <CompetitionCard
              icon={<GraduationCap className="h-6 w-6" />}
              title="High School Essay Competition"
              description="An insightful essay competition for high school students to discover and express their views on the future of energy, critical thinking, writing ability, covering topics around energy, society, and sustainability."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SEEK OPPORTUNITIES
         ══════════════════════════════════════ */}
      <section id="events" className="bg-purple px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-extrabold text-cream sm:text-4xl">
            SEEK OPPORTUNITIES
          </h2>

          <div className="mx-auto max-w-2xl rounded-2xl border-2 border-navy bg-cream p-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-orange">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-navy">
              WiACT (Community Service)
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-navy/70">
              This side event is a social engagement activity with children,
              conducted in kid-friendly and creative settings that encourage
              curiosity. It is aimed to spread awareness to increase
              participants in participating and contributing to voluntary work
              and education.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-[20px] bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TIMELINE
         ══════════════════════════════════════ */}
      <section id="timeline" className="bg-indigo px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-extrabold text-cream sm:text-4xl">
            TIMELINE
          </h2>

          <div className="relative flex flex-wrap items-start justify-center gap-12 sm:gap-16 md:gap-24">
            <div className="absolute top-8 left-1/2 hidden h-0.5 w-3/4 -translate-x-1/2 bg-orange/40 md:block" />

            <TimelineItem icon={<Mic className="h-6 w-6" />} label="Webinar" />
            <TimelineItem
              icon={<CalendarDays className="h-6 w-6" />}
              label="Side-Event"
            />
            <TimelineItem
              icon={<Trophy className="h-6 w-6" />}
              label="Competition"
            />
            <TimelineItem
              icon={<Award className="h-6 w-6" />}
              label="Grand Seminar"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
