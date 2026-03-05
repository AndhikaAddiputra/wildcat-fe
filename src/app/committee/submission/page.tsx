"use client";

import { useState } from "react";
import {
  Button,
  Navbar,
  Footer,
} from "@/components/ui";
import { LOGO, COMMITTEE_NAV_LINKS, COMMITTEE_NAV_ACTION } from "@/config/navbar-config";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Funnel,
  Download,
} from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <div className="relative min-h-screen flex-1 bg-[url(/background-hero-still.svg)] bg-cover">
        <Navbar
          logo={LOGO}
          links={COMMITTEE_NAV_LINKS}
          activeLink="/committee/submission"
          action={COMMITTEE_NAV_ACTION}
          mobileAction={COMMITTEE_NAV_ACTION}
        />

      {/* Hero Section */}
      <section className="relative flex pt-32 mx-auto w-[80%] items-center">
        <div className="text-left">
          <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Participant's Submission
          </h3>
          <p className="mt-2 text-2xl font-semibold text-[#F1E1B4]">
            Download and track participant's submission here
          </p>
        </div>
      </section>

      <main className="flex justify-center mx-auto py-12 min-h-[55vw]">
        <section className="w-[80%]">
          <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h4 className="font-semibold text-[36px] text-cream">
                  Paper & Poster
                </h4>
              </div>
              <div className="flex justify-between w-[400px]">
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  <RotateCw size={16} />
                  Refresh
                </Button>
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  <Funnel fill="#0b2e6f" size={16} />
                  Filter
                </Button>
              </div>
            </div>
            <div className="w-full pt-8 app-table-wrapper">
              <table className="app-table">
                <colgroup>
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr className="text-white">
                    <th>Submission Date</th>
                    <th>Team Name</th>
                    <th>Abstract</th>
                    <th>Full Paper</th>
                    <th>Poster</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    { comp: "22/03/2026 19:53:20", team: "Schutzschtaffel" },
                    { comp: "22/03/2026 19:54:01", team: "Sternritter" },
                    { comp: "23/03/2026 08:14:53", team: "Division Zero" },
                  ].map((row, i, arr) => (
                    <tr key={i} className="border-t">
                      <td>{row.comp}</td>
                      <td>{row.team}</td>
                      <td className="action">
                        <Button variant="secondary">
                          Download
                          <Download size={16} />
                        </Button>
                      </td>
                      <td className="action">
                        <span><i>Not available</i></span>
                      </td>
                      <td className="action">
                        <span><i>Not available</i></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-6 mt-[-10px] rounded-t-xl w-full bg-[#3c3f9e]">
                <div className="flex items-center gap-4">
                  <span className="text-cream font-semibold">Show data per page: </span>
                  <input type="number" min={1} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                  {/* <div className="flex items-center bg-navy rounded-2xl px-6 py-3 gap-4">
                    <span className="text-2xl font-bold text-white">7</span>

                    <div className="flex flex-col">
                      <button className="text-white leading-none">▲</button>
                      <button className="text-white leading-none">▼</button>
                    </div>
                  </div> */}
                </div>
                <div className="w-[400px] min-w-fit flex justify-between items-center">
                  <Button variant="secondary" size="md" className="w-[125px] min-w-fit">
                    <ChevronLeft />
                    Previous
                  </Button>
                  <input type="number" min={1} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                  {/* <div className="flex items-center bg-navy rounded-2xl px-6 py-3 gap-4">
                    <span className="text-2xl font-bold text-white">7</span>

                    <div className="flex flex-col">
                      <button className="text-white leading-none">▲</button>
                      <button className="text-white leading-none">▼</button>
                    </div>
                  </div> */}
                  <Button variant="secondary" size="md" className="w-[125px] min-w-fit">
                    Next
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12 mt-6">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h4 className="font-semibold text-[36px] text-cream">
                  Business Case
                </h4>
              </div>
              <div className="flex justify-between w-[400px]">
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  <RotateCw size={16} />
                  Refresh
                </Button>
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  <Funnel fill="#0b2e6f" size={16} />
                  Filter
                </Button>
              </div>
            </div>
            <div className="w-full pt-8 app-table-wrapper">
              <table className="app-table">
                <colgroup>
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr className="text-white">
                    <th>Submission Date</th>
                    <th>Team Name</th>
                    <th>Executive Summary</th>
                    <th>Pitch Deck</th>
                    <th>Final Proposal</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    { comp: "22/03/2026 19:53:20", team: "Schutzschtaffel" },
                    { comp: "22/03/2026 19:54:01", team: "Sternritter" },
                    { comp: "23/03/2026 08:14:53", team: "Division Zero" },
                  ].map((row, i, arr) => (
                    <tr key={i} className="border-t">
                      <td>{row.comp}</td>
                      <td>{row.team}</td>
                      <td className="action">
                        <Button variant="secondary">
                          Download
                          <Download size={16} />
                        </Button>
                      </td>
                      <td className="action">
                        <Button variant="secondary">
                          Download
                          <Download size={16} />
                        </Button>
                      </td>
                      <td className="action">
                        <span><i>Not available</i></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-6 mt-[-10px] rounded-t-xl w-full bg-[#3c3f9e]">
                <div className="flex items-center gap-4">
                  <span className="text-cream font-semibold">Show data per page: </span>
                  <input type="number" min={1} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                  {/* <div className="flex items-center bg-navy rounded-2xl px-6 py-3 gap-4">
                    <span className="text-2xl font-bold text-white">7</span>

                    <div className="flex flex-col">
                      <button className="text-white leading-none">▲</button>
                      <button className="text-white leading-none">▼</button>
                    </div>
                  </div> */}
                </div>
                <div className="w-[400px] min-w-fit flex justify-between items-center">
                  <Button variant="secondary" size="md" className="w-[125px] min-w-fit">
                    <ChevronLeft />
                    Previous
                  </Button>
                  <input type="number" min={1} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                  {/* <div className="flex items-center bg-navy rounded-2xl px-6 py-3 gap-4">
                    <span className="text-2xl font-bold text-white">7</span>

                    <div className="flex flex-col">
                      <button className="text-white leading-none">▲</button>
                      <button className="text-white leading-none">▼</button>
                    </div>
                  </div> */}
                  <Button variant="secondary" size="md" className="w-[125px] min-w-fit">
                    Next
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12 mt-6">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h4 className="font-semibold text-[36px] text-cream">
                  High School Essay
                </h4>
              </div>
              <div className="flex justify-between w-[400px]">
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  <RotateCw size={16} />
                  Refresh
                </Button>
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  <Funnel fill="#0b2e6f" size={16} />
                  Filter
                </Button>
              </div>
            </div>
            <div className="w-full pt-8 app-table-wrapper">
              <table className="app-table">
                <colgroup>
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "25%" }} />
                </colgroup>
                <thead>
                  <tr className="text-white">
                    <th>Submission Date</th>
                    <th>Team Name</th>
                    <th>Abstract</th>
                    <th>Full Essay</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    { comp: "22/03/2026 19:53:20", team: "Schutzschtaffel" },
                    { comp: "22/03/2026 19:54:01", team: "Sternritter" },
                    { comp: "23/03/2026 08:14:53", team: "Division Zero" },
                  ].map((row, i, arr) => (
                    <tr key={i} className="border-t">
                      <td>{row.comp}</td>
                      <td>{row.team}</td>
                      <td className="action">
                        <Button variant="secondary">
                          Download
                          <Download size={16} />
                        </Button>
                      </td>
                      <td className="action">
                        <Button variant="secondary">
                          Download
                          <Download size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-6 mt-[-10px] rounded-t-xl w-full bg-[#3c3f9e]">
                <div className="flex items-center gap-4">
                  <span className="text-cream font-semibold">Show data per page: </span>
                  <input type="number" min={1} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                  {/* <div className="flex items-center bg-navy rounded-2xl px-6 py-3 gap-4">
                    <span className="text-2xl font-bold text-white">7</span>

                    <div className="flex flex-col">
                      <button className="text-white leading-none">▲</button>
                      <button className="text-white leading-none">▼</button>
                    </div>
                  </div> */}
                </div>
                <div className="w-[400px] min-w-fit flex justify-between items-center">
                  <Button variant="secondary" size="md" className="w-[125px] min-w-fit">
                    <ChevronLeft />
                    Previous
                  </Button>
                  <input type="number" min={1} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                  {/* <div className="flex items-center bg-navy rounded-2xl px-6 py-3 gap-4">
                    <span className="text-2xl font-bold text-white">7</span>

                    <div className="flex flex-col">
                      <button className="text-white leading-none">▲</button>
                      <button className="text-white leading-none">▼</button>
                    </div>
                  </div> */}
                  <Button variant="secondary" size="md" className="w-[125px] min-w-fit">
                    Next
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12 mt-6">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h4 className="font-semibold text-[36px] text-cream">
                  GnG Case Study
                </h4>
              </div>
              <div className="flex justify-between w-[400px]">
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  <RotateCw size={16} />
                  Refresh
                </Button>
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  <Funnel fill="#0b2e6f" size={16} />
                  Filter
                </Button>
              </div>
            </div>
            <div className="w-full pt-8 app-table-wrapper">
              <table className="app-table">
                <colgroup>
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "25%" }} />
                </colgroup>
                <thead>
                  <tr className="text-white">
                    <th>Submission Date</th>
                    <th>Team Name</th>
                    <th>Technical Essay</th>
                    <th>Technical Report</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    { comp: "22/03/2026 19:53:20", team: "Schutzschtaffel" },
                    { comp: "22/03/2026 19:54:01", team: "Sternritter" },
                    { comp: "23/03/2026 08:14:53", team: "Division Zero" },
                  ].map((row, i, arr) => (
                    <tr key={i} className="border-t">
                      <td>{row.comp}</td>
                      <td>{row.team}</td>
                      <td className="action">
                        <Button variant="secondary">
                          Download
                          <Download size={16} />
                        </Button>
                      </td>
                      <td className="action">
                        <span><i>Not available</i></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-6 mt-[-10px] rounded-t-xl w-full bg-[#3c3f9e]">
                <div className="flex items-center gap-4">
                  <span className="text-cream font-semibold">Show data per page: </span>
                  <input type="number" min={1} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                  {/* <div className="flex items-center bg-navy rounded-2xl px-6 py-3 gap-4">
                    <span className="text-2xl font-bold text-white">7</span>

                    <div className="flex flex-col">
                      <button className="text-white leading-none">▲</button>
                      <button className="text-white leading-none">▼</button>
                    </div>
                  </div> */}
                </div>
                <div className="w-[400px] min-w-fit flex justify-between items-center">
                  <Button variant="secondary" size="md" className="w-[125px] min-w-fit">
                    <ChevronLeft />
                    Previous
                  </Button>
                  <input type="number" min={1} className="w-[95px] h-[51px] bg-navy text-white text-center font-bold rounded-[20px] outline-none" />
                  {/* <div className="flex items-center bg-navy rounded-2xl px-6 py-3 gap-4">
                    <span className="text-2xl font-bold text-white">7</span>

                    <div className="flex flex-col">
                      <button className="text-white leading-none">▲</button>
                      <button className="text-white leading-none">▼</button>
                    </div>
                  </div> */}
                  <Button variant="secondary" size="md" className="w-[125px] min-w-fit">
                    Next
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      </div>

      <Footer />
    </div>
  );
}