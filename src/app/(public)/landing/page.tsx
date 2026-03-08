"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CompetitionCardBase,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Navbar,
  Footer,
  Modal,
} from "@/components/ui";
import {
  LOGO,
  LANDING_NAV_LINKS,
  LANDING_NAV_ACTION,
} from "@/config/navbar-config";
import { getGuidebookUrl } from "@/lib/constants/guidebooks";
import type { ModalTimelineItem } from "@/components/ui";
import {
  ArrowRight,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SECTION_IDS = ["#about", "#competitions", "#events", "#timeline"] as const;

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
      "The webinar session invites professional speakers from the field of petroleum geoscience to share insights and current industry developments. It is designed to broaden participants' perspectives and deepen their understanding of real-world challenges and opportunities.",
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
  const [contentRevealed, setContentRevealed] = useState(false);
  const [openCompetitionId, setOpenCompetitionId] = useState<string | null>(null);
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [eventCarouselIndex, setEventCarouselIndex] = useState(0);
  const [failedCompImages, setFailedCompImages] = useState<Set<string>>(new Set());
  const contentSectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const el = contentSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setContentRevealed(true);
        });
      },
      { rootMargin: "-10% 0px -20% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy text-white">
      <Navbar
        logo={LOGO}
        links={LANDING_NAV_LINKS}
        activeLink={activeSection}
        action={LANDING_NAV_ACTION}
        mobileAction={LANDING_NAV_ACTION}
      />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/background-hero-still.svg')" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/background-hero-move.svg"
            alt=""
            className="animate-spin-slow-reverse h-[140%] w-[140%] max-w-none object-contain opacity-75"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <img
            src="/Main-title.svg"
            alt="WILDCAT 2026"
            className="mb-8 h-auto w-full max-w-[min(90vw,520px)] sm:max-w-[min(85vw,640px)]"
          />
          <p className="mx-auto mb-10 max-w-xl text-base font-semibold leading-relaxed text-[#f1e1b4] sm:text-2xl">
            Leading Petroleum Geoscience to Fuel the Future of Oil and Gas
          </p>
          <Link href="/register">
            <Button size="lg" variant="primary">
              Register Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section
        id="content"
        ref={contentSectionRef}
        className="relative -mt-40 md:-mt-48"
      >
        <div
          className="absolute left-0 right-0 bottom-0 top-[140px] z-0 bg-gradient-to-b from-[#0A2D6E] via-[#7E74CD] to-[#0A2D6E] sm:top-[160px] md:top-[180px]"
          aria-hidden
        />
        <div
          className={`relative z-10 transition-all duration-700 ease-out pt-8 md:pt-12 ${
            contentRevealed
              ? "translate-y-0 opacity-100"
              : "translate-y-16 opacity-0"
          }`}
        >
          <div className="w-full overflow-hidden leading-[0]">
            <div className="hidden w-full md:block" style={{ aspectRatio: "1601/275" }}>
              <img
                src="/Transition.svg"
                alt=""
                className="block h-full w-full object-cover object-top"
                width={1610}
                height={273}
              />
            </div>
            <div className="w-full md:hidden" style={{ height: "145px" }} aria-hidden />
          </div>

      <section id="about" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-orange px-6 py-2 text-xs font-bold uppercase tracking-widest text-orange">
              ABOUT THE EVENT
            </span>
          </div>
          <h2 className="mb-4 text-center text-3xl font-extrabold sm:text-4xl bg-gradient-to-r from-orange to-amber-400 bg-clip-text text-transparent">
            WHAT IS WILDCAT?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-[#f1e1b4] sm:text-base">
            Wildcat AAPG ITB 2026 is an annual Petroleum Geoscience-themed
            competition and industry engagement platform designed to simulate
            real subsurface workflows in oil and gas.
          </p>
          <Card className="rounded-[20px] border border-[#F6911E] bg-[#0A2D6E] dark:!bg-[#0A2D6E] shadow-[0_0_15px_rgba(246,145,30,0.4)] shadow-[0_0_10px_4px_rgba(246,145,60,1)]">
            <div className="grid gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-10">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange">Our Vision</p>
                <h3 className="mb-3 text-xl font-bold text-[#f1e1b4]">A Gateway to Excellence</h3>
                <p className="text-sm leading-relaxed text-justify text-[#f1e1b4]/90">
                  To create a platform for wide ranges of people to learn,
                  progress, and lead Petroleum Geoscience and embody Wildcat
                  AAPG ITB 2026 as a gateway to excellence.
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange">Our Theme</p>
                <h3 className="mb-3 text-xl font-bold text-[#f1e1b4]">Fueling the Future</h3>
                <p className="text-sm leading-relaxed text-justify text-[#f1e1b4]/90">
                  &ldquo;Leading Petroleum Geoscience to Fuel the Future of Oil
                  and Gas&rdquo; — connecting scientific insight with
                  technological progress and industry responsibility.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="competitions" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-orange px-6 py-2 text-xs font-bold uppercase tracking-widest text-orange">
              OUR COMPETITIONS
            </span>
          </div>
          <h2 className="mb-8 text-center text-3xl font-extrabold sm:text-4xl bg-gradient-to-r from-orange to-amber-400 bg-clip-text text-transparent">
            CHOOSE YOUR PATH!
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {COMPETITIONS.map((comp) => (
              <CompetitionCardBase
                key={comp.id}
                className="flex max-w-none flex-col p-8"
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4 p-0">
                  <CardTitle className="!text-3xl !font-bold leading-tight !text-[#f1e1b4]">
                    {comp.title}
                  </CardTitle>
                  {comp.imageUrl && !failedCompImages.has(comp.id) ? (
                    <img
                      src={comp.imageUrl}
                      alt=""
                      className="h-20 w-20 shrink-0 object-contain"
                      onError={() => setFailedCompImages((prev) => new Set(prev).add(comp.id))}
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 rotate-45 items-center justify-center rounded-lg border-2 border-[#F6911E] bg-transparent">
                      <X className="h-5 w-5 -rotate-45 text-[#F6911E]" />
                    </div>
                  )}
                </CardHeader>
                <CardDescription className="flex-1 px-0 pt-4 text-sm leading-relaxed text-justify !text-[#f1e1b4]">
                  {comp.description}
                </CardDescription>
                <CardFooter className="flex justify-end p-0 pt-6">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setOpenCompetitionId(comp.id)}
                  >
                    Learn More
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </CompetitionCardBase>
            ))}
          </div>
        </div>
      </section>

      {openCompetitionId && (() => {
        const comp = COMPETITIONS.find((c) => c.id === openCompetitionId);
        if (!comp) return null;
        return (
          <Modal
            isOpen={!!openCompetitionId}
            onClose={() => setOpenCompetitionId(null)}
            variant="competition"
            eventName={comp.title}
            eventDescription={comp.description}
            timeline={comp.timeline.map((item) => ({
              ...item,
              isActive: item.isActive ?? isTimelineDateReached(item.date),
            }))}
            competitionImageUrl={comp.imageUrl}
            guidebookUrl={getGuidebookUrl(comp.id)}
          />
        );
      })()}

      <section id="events" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-orange px-6 py-2 text-xs font-bold uppercase tracking-widest text-orange">
              OUR EVENTS
            </span>
          </div>
          <h2 className="mb-10 text-center text-3xl font-extrabold sm:text-4xl bg-gradient-to-r from-orange to-amber-400 bg-clip-text text-transparent">
            SEEK OPPORTUNITIES
          </h2>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setEventCarouselIndex((i) => (i <= 0 ? EVENTS.length - 1 : i - 1))}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#F6911E] bg-transparent text-[#F6911E] transition-opacity hover:opacity-90"
              aria-label="Event sebelumnya"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="min-h-[320px] w-full max-w-2xl overflow-hidden">
              {EVENTS.map((ev, idx) => (
                <div
                  key={ev.id}
                  className={idx === eventCarouselIndex ? "block" : "hidden"}
                >
                  <div className="rounded-[20px] border border-[#F6911E] bg-[#0A2D6E] p-8 font-sans !shadow-[0_0_15px_rgba(246,145,30,0.4)] !shadow-[0_0_10px_4px_rgba(246,145,60,1)]">
                    <div className="mb-4 flex items-center gap-2">
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase",
                          ev.status === "available" && "border-green-500 text-green-400",
                          ev.status === "not_started" && "border-amber-400 text-amber-400",
                          ev.status === "ended" && "border-red-500 text-red-400",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-2 w-2 rounded-full",
                            ev.status === "available" && "bg-green-500",
                            ev.status === "not_started" && "bg-amber-400",
                            ev.status === "ended" && "bg-red-500",
                          ].join(" ")}
                        />
                        {ev.status === "available" && "Available"}
                        {ev.status === "not_started" && "Not Yet Started"}
                        {ev.status === "ended" && "Event Ended"}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold !text-[#f1e1b4] sm:text-2xl">{ev.title}</h3>
                    <p className="mb-6 text-sm leading-relaxed !text-[#f1e1b4]/90 text-justify">{ev.description}</p>
                    <div className="flex justify-end">
                      <Button variant="primary" size="md" onClick={() => setOpenEventId(ev.id)}>
                        Learn More
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setEventCarouselIndex((i) => (i >= EVENTS.length - 1 ? 0 : i + 1))}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#F6911E] bg-transparent text-[#F6911E] transition-opacity hover:opacity-90"
              aria-label="Event berikutnya"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {EVENTS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setEventCarouselIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === eventCarouselIndex ? "w-6 bg-[#F6911E]" : "w-2 bg-[#f1e1b4]/40"
                }`}
                aria-label={`Go to event ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {openEventId && (() => {
        const ev = EVENTS.find((e) => e.id === openEventId);
        if (!ev) return null;
        return (
          <Modal
            isOpen={!!openEventId}
            onClose={() => setOpenEventId(null)}
            variant="event"
            eventName={ev.title}
            eventDescription={ev.description}
            eventDate={ev.eventDate}
            eventPlace={ev.eventPlace}
            eventSpeaker={ev.eventSpeaker}
          />
        );
      })()}

      <section id="timeline" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-orange px-6 py-2 text-xs font-bold uppercase tracking-widest text-orange shadow-[0_0_12px_rgba(246,145,30,0.3)]">
              GRAND TIMELINE
            </span>
          </div>
          <h2 className="mb-10 text-center text-3xl font-extrabold uppercase tracking-tight sm:text-4xl bg-gradient-to-r from-orange to-amber-400 bg-clip-text text-transparent">
            TIMELINE
          </h2>
          <div className="relative">
            <div className="relative w-full overflow-hidden rounded-2xl">
              <img
                src="/TimelineSlider.png"
                alt="Grand Timeline"
                className="w-full max-w-4xl mx-auto h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

        </div>
      </section>

      <Footer />
    </div>
  );
}
