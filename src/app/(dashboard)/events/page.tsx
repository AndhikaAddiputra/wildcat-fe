"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Navbar,
  Footer,
  Modal,
} from "@/components/ui";
import { LOGO, PARTICIPANT_NAV_LINKS, PARTICIPANT_NAV_ACTION } from "@/config/navbar-config";
import { ExternalLink } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { computeEventStatus, type EventStatus } from "@/lib/utils/event-status";

interface EventDisplay {
  id: string;
  title: string;
  description: string;
  status: EventStatus;
  eventDate: string;
  eventPlace: string;
  eventSpeaker: string;
}

/** Static events fallback (WiAct dihapus, status computed H-14 + webinar=ended) */
const STATIC_EVENTS_RAW: Omit<EventDisplay, "status">[] = [
  { id: "wishare", title: "WISHARE (Charity Program)", description: "This charity program aims to support selected beneficiaries through fundraising and donation activities conducted throughout the event series. It reflects the event's commitment to social contribution by encouraging meaningful actions with a direct impact on the community.", eventDate: "17 March 2026", eventPlace: "TBA", eventSpeaker: "Soon to be announced" },
  { id: "field-trip", title: "Field Trip", description: "The Field Trip is a collective outdoor activity where participants, including finalists, visit various geological sites to observe features firsthand. Expert speakers facilitate the trip to provide a comprehensive understanding of geological processes and their real-world applications.", eventDate: "22 June 2026", eventPlace: "TBA", eventSpeaker: "Soon to be announced" },
  { id: "webinar", title: "Webinar", description: "The webinar session invites professional speakers from the field of petroleum geoscience to share insights and current industry developments. This is designed to broaden participants' perspectives and deepen their understanding of real-world challenges and opportunities.", eventDate: "14 March 2026", eventPlace: "Online via Zoom Meeting", eventSpeaker: "Soon to be announced" },
  { id: "grand-seminar", title: "Grand Seminar", description: "Held during the final stage, the Grand Seminar features various academic and professional speakers in keynote talks and panel discussions. This session aims to enrich participants' knowledge, inspire critical thinking, and provide deeper insights related to petroleum geoscience.", eventDate: "21 June 2026", eventPlace: "TBA", eventSpeaker: "Soon to be announced" },
];

function toEventDisplay(item: { id: string; name?: string; title?: string; description?: string; datetime?: string; location?: string; speaker?: string }): EventDisplay {
  const eventDate = item.datetime ?? "TBA";
  const status = computeEventStatus(item.id, eventDate);
  return {
    id: item.id,
    title: item.name ?? item.title ?? "Event",
    description: item.description ?? "",
    status,
    eventDate,
    eventPlace: item.location ?? "TBA",
    eventSpeaker: item.speaker ?? "Soon to be announced",
  };
}

export default function Event() {
  const { data: apiEvents, loading, error } = useEvents();
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  const events = useMemo(() => {
    if (apiEvents.length > 0) {
      return apiEvents.map((e) => toEventDisplay({
        id: e.id,
        name: e.name,
        description: e.description ?? undefined,
        datetime: e.datetime,
        location: e.location ?? undefined,
        speaker: e.speaker ?? undefined,
      }));
    }
    return STATIC_EVENTS_RAW.map((ev) => ({
      ...ev,
      status: computeEventStatus(ev.id, ev.eventDate),
    }));
  }, [apiEvents]);

  return (
    <div className="min-h-screen bg-[url(/background-hero-still.svg)] bg-cover text-white">
      <Navbar
        logo={LOGO}
        links={PARTICIPANT_NAV_LINKS}
        activeLink="/events"
        action={PARTICIPANT_NAV_ACTION}
        mobileAction={PARTICIPANT_NAV_ACTION}
      />

      {/* Hero Section */}
      <section className="relative flex pt-36 pb-8 justify-center pt-20">
        <div className="text-left mx-auto w-[80vw]">
          <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Events
          </h3>
          <p className="text-2xl font-semibold text-[#F1E1B4]">
            Explore our exciting events!
          </p>
        </div>
      </section>

      <main className="flex justify-center mx-auto px-6 py-12 min-h-[55vw]">
        <section className="flex flex-col gap-6">
          {error && <p className="text-center text-red-300">{error}</p>}
          {loading && <p className="text-center text-[#F1E1B4]">Loading events...</p>}
          {events.map((ev) => (
            <div
              key={ev.id}
              className="w-[80vw] rounded-[20px] border border-[#F6911E] bg-[#0A2D6E] p-8 font-sans !shadow-[0_0_15px_rgba(246,145,30,0.4)] !shadow-[0_0_10px_4px_rgba(246,145,60,1)]"
            >
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
              <h3 className="mb-3 text-xl font-bold !text-[#f1e1b4] sm:text-2xl">
                {ev.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed !text-[#f1e1b4]/90 text-justify sm:text-base">
                {ev.description}
              </p>
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setOpenEventId(ev.id)}
                >
                  Learn More
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Modal event */}
      {openEventId && (() => {
        const ev = events.find((e) => e.id === openEventId);
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
            eventStatus={ev.status}
          />
        );
      })()}

      <Footer />
    </div>
  );
}
