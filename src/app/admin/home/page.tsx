"use client";

import {
  Navbar,
  Footer,
  Button,
  CardLarge,
} from "@/components/ui";
import { LOGO, ADMIN_NAV_LINKS, ADMIN_NAV_ACTION } from "@/config/navbar-config";
import { Users, Download, Pencil } from "lucide-react";

export default function AdminStatisticsPage() {

  const chartData = [
  { day: "Mon", value: 200 },
  { day: "Tue", value: 450 },
  { day: "Wed", value: 300 },
  { day: "Today", value: 700 }, // The line will stop here
  { day: "Fri", value: null },
  { day: "Sat", value: null },
  { day: "Sun", value: null },
  ];

  // 2. Constants for the SVG
  const maxValue = 1000;
  const width = 1000; // Reference width
  const height = 300;  // Reference height
  const paddingX = 50;
  const paddingY = 40;

  // 3. Filter data to only include points with values (stops the line at Today)
  const activePoints = chartData.filter(d => d.value !== null);

  const polylinePoints = activePoints
    .map((d, i) => {
      const x = (i / (chartData.length - 1)) * (width - paddingX * 2) + paddingX;
      const y = height - (d.value! / maxValue) * (height - paddingY * 2) - paddingY;
      return `${x},${y}`;
    })
    .join(' ');

  // Get the specific X,Y for the "Today" dot
  const todayIndex = chartData.findIndex(d => d.day === "Today");
  const todayX = (todayIndex / (chartData.length - 1)) * (width - paddingX * 2) + paddingX;
  const todayValue = chartData[todayIndex].value || 0;
  const todayY = height - (todayValue / maxValue) * (height - paddingY * 2) - paddingY;

  // Data Mock untuk Statistik Event
  const eventStats = [
    { name: "Webinar (AAPG Insight Seminar)", date: "14 March 2026", registered: 190, present: 133 },
    { name: "WiACT", date: "14 March 2026", registered: 210, present: 200 },
    { name: "WISHARE", date: "14 March 2028", registered: 80, present: 50 },
    { name: "Field Trip", date: "14 March 2026", registered: 220, present: 200 },
    { name: "Grand Seminar", date: "14 March 2026", registered: 100, present: 0 },
  ];


  return (
    <div className="min-h-screen w-full font-['Poppins']">
      {/* Area biru + background hanya sampai sebelum footer */}
      <div className="relative min-h-screen bg-[#0A2D6E]">
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "url('/background-home.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Navbar
          logo={LOGO}
          links={ADMIN_NAV_LINKS}
          activeLink="/admin/home"
          action={ADMIN_NAV_ACTION}
          mobileAction={ADMIN_NAV_ACTION}
        />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-20">
        {/* Welcome Admin */}
        <section className="mb-10">
          <h1 className="text-4xl font-bold text-[#F6911E] sm:text-5xl">
            Hello, [Account's Name]!
          </h1>
          <p className="mt-2 text-2xl font-semibold text-[#F1E1B4]">
            Welcome to your personal dashboard
          </p>
        </section>

        {/* Statistics Main Container */}
        <CardLarge className="p-8 bg-[#0A2D6E]/90 border-[#F6911E]/30 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-[#F1E1B4] mb-8">Wildcat on Statistics</h2>

          {/* Top Grid: Competitions & Events Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#3c3c9c] p-8 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#F6911E] font-bold text-xl">Competitions</span>
                <Users className="text-[#F6911E] h-8 w-8" />
              </div>
              <div className="text-center">
                <p className="text-6xl font-black text-[#F6911E] mb-2 tracking-tighter">1000</p>
                <p className="text-[#F69e11] text-sm font-semibold">Participants</p>
              </div>
            </div>

            <div className="bg-[#3c3c9c] p-8 rounded-2xl border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[#F6911E] font-bold text-xl">Events</span>
                <Users className="text-[#F6911E] h-8 w-8" />
              </div>
              <div className="text-center">
                <p className="text-6xl font-black text-[#F6911E] mb-2 tracking-tighter">800</p>
                <p className="text-[#F69e11] text-sm font-semibold">Participants</p>
              </div>
            </div>
          </div>

          {/* Participants Tracker Placeholder (Graph Area) */}
          <div className="bg-[#3c3c9c] p-6 rounded-2xl border border-white/5 mb-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-orange font-bold">Participants Tracker</span>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#F6911E] h-7 text-[10px] text-[#0A2D6E] font-bold">Competition</Button>
                <Button size="sm" variant="outline" className="h-7 text-[10px] text-white border-white/20">Events</Button>
              </div>
            </div>

            <div className="relative w-full h-[300px]">
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-full"
                preserveAspectRatio="none" // Ensures it stretches to fit container without scroll
              >
                {/* Horizontal Grid Lines */}
                {[0, 250, 500, 750, 1000].map((tick) => {
                  const y = height - (tick / maxValue) * (height - paddingY * 2) - paddingY;
                  return (
                    <g key={tick}>
                      <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#F1E1B4" strokeWidth="1" className="opacity-20" />
                      <text x="0" y={y + 4} fill="#F6911e" fontSize="14">{tick}</text>
                    </g>
                  );
                })}

                {/* Today Vertical Indicator */}
                <line 
                  x1={todayX} y1={paddingY} 
                  x2={todayX} y2={height - paddingY} 
                  stroke="#F6911E" strokeDasharray="6 4" strokeWidth="2" className="opacity-40"
                />

                {/* The Actual Data Line (Stops at Today) */}
                <polyline
                  fill="none"
                  stroke="#F6911E"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={polylinePoints}
                />

                {/* Today's "Real-time" Pulse Dot */}
                <circle cx={todayX} cy={todayY} r="8" fill="#F6911E" className="animate-pulse" />
                <circle cx={todayX} cy={todayY} r="4" fill="white" />

                {/* X-Axis Labels */}
                {chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * (width - paddingX * 2) + paddingX;
                  return (
                    <text 
                      key={i} x={x} y={height - 5} 
                      textAnchor="middle" 
                      fill={d.day === "Today" ? "#F6911E" : "#F1E1B4"} 
                      fontSize="14" 
                      fontWeight={d.day === "Today" ? "bold" : "normal"}
                    >
                      {d.day}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>
          
          {/* Competition Specific Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Paper & Poster", value: 190 },
              { label: "Business Case", value: 210 },
              { label: "GnG Case Study", value: 320 },
              { label: "Essay", value: 500 },
            ].map((comp, idx) => (
              <div key={idx} className="bg-[#3c3c9c] p-6 rounded-2xl border border-white/10 text-center">
                <p className="text-[#F6911E] text-md font-bold mb-3 uppercase">{comp.label}</p>
                <p className="text-6xl font-black text-[#F6911E] mb-3">{comp.value}</p>
                <p className="text-[#F6911e] text-sm">Team Registered</p>
              </div>
            ))}
          </div>

          {/* Detailed Event List */}

            <div className="space-y-4 mb-10">
            {eventStats.map((event, idx) => (
                <div key={idx} className="bg-[#3c3c93] p-5 rounded-2xl flex flex-row items-center justify-between  border border-white/5">
                <div className="w-full md:w-auto mb-4 md:mb-0">
                    <p className="text-[#F6911E] font-bold text-md">{event.name}</p>
                    <p className="text-[#F6911E] text-sm">{event.date}</p>
                </div>

                <div className="flex items-center gap-10">
                    {/* Ikon Pertama: Registered (Diberi lebar tetap agar sejajar) */}
                    <div className="flex items-center justify-end gap-3 w-30"> 
                      <span className="text-[#F6911E] text-3xl font-black">{event.registered}</span>
                      <Users className="h-10 w-10 text-[#F6911E] flex-shrink-0" />
                    </div>

                    {/* Ikon Kedua: Present */}
                    <div className="flex items-center justify-end gap-3 w-60">
                    <span className="text-[#F6911E] text-3xl font-black">{event.present}</span>
                    <div className="relative flex-shrink-0">
                        <Users className="h-10 w-10 text-[#F6911E]" />
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full h-2.5 w-2.5 border-2 border-[#1E3A8A]" />
                    </div>
                    <Button variant="outline" className="ml-6 border-3 !border-[#F6911E] !text-[#F6911E] min-w-[100px]"><Pencil className="h-4 w-4" />Edit</Button>
                    </div>
                </div>
                </div>
            ))}
            </div>

          {/* Legend & Export */}
          <div className="flex flex-col mb-10 md:flex-row justify-between items-center gap-6">
            <div className="flex gap-6 text-[10px] text-[#F6911e]">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#F6911E]" />
                <span>Participants Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Users className="h-5 w-5 text-[#F6911E]" />
                  <div className="absolute -top-0.5 -right-0.5 bg-green-500 rounded-full h-1 w-1" />
                </div>
                <span>Participants Present (*Please contact admin for manually update)</span>
              </div>
            </div>
          </div>

          <Button className="max-width bg-[#F6911E] text-[#0A2D6E] font-bold w-full px-12 h-12 rounded-xl flex gap-2">
              Export Data
            </Button>

        </CardLarge>
      </main>
      </div>

      <Footer />
    </div>
  );
}