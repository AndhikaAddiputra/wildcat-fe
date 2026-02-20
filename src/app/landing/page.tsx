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

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Competitions", href: "#competitions" },
    { label: "Events", href: "#events" },
    { label: "Timeline", href: "#timeline" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy text-white">
      {/* Navbar */}
      <Navbar
        logo={
          <img src="/wildcat-logo.svg" alt="Wildcat" className="h-14 w-auto" />
        }
        links={navLinks}
        activeLink={activeSection}
        action={
          <Button variant="outline" size="lg">
            Login
          </Button>
        }
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
