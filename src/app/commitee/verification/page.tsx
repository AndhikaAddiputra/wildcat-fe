"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardSmall,    
  CardMedium,   
  CardLarge,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Badge,
  Avatar,
  Modal,
  Separator,
  Navbar,
  Footer,
} from "@/components/ui";
import {
  Heart,
  Star,
  Search,
  Bell,
  Settings,
  User,
  Mail,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  LogIn,
  ExternalLink,
  Trash2,
  Plus,
  Download,
  Share2,
  Zap,
  Shield,
  Globe,
  Rocket,
  Circle,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  Funnel,
  RotateCw,
} from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Verification", href: "/commitee/verification" },
    { label: "Submission", href: "/commitee/submission" },
  ];

  return (
    <div className="min-h-screen bg-[url(/background-hero-still.svg)] bg-cover text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');`}</style>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Poppins:wght@400;600;700&display=swap');`}</style>
      {/* Navbar - transparent to solid */}
      <Navbar
        logo={
          <img src="/wildcat-logo.svg" alt="Wildcat" className="h-20 w-auto" />
        }
        links={navLinks}
        activeLink="/commitee/verification"
        action={
          <Button variant="outline" size="lg">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        }
      />

      {/* Hero Section */}
      <section className="relative flex pt-32 mx-auto w-[80%] items-center">
        <div className="text-left">
          <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Verification Control
          </h3>
          <p className="">
            Verify the required documents from each team here
          </p>
        </div>
      </section>

      <main className="flex justify-center mx-auto py-12 min-h-[55vw]">
        <section className="w-[80%]">
          <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h4 className="font-semibold text-[36px] text-cream">
                  Registration Documents
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
                <thead>
                  <tr className="bg-[#3c3f9e] text-cream">
                    <th>Competition</th>
                    <th>Team Name</th>
                    <th>KTM</th>
                    <th>Twibbon</th>
                    <th>Poster</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    { comp: "Business", team: "Schutzschtaffel" },
                    { comp: "Essay", team: "Sternritter" },
                    { comp: "Business", team: "Division Zero" },
                  ].map((row, i, arr) => (
                    <tr key={i} className="border-t">
                      <td>{row.comp}</td>
                      <td>{row.team}</td>
                      <td className="action">
                        <Button variant="secondary">
                          Choose
                        </Button>
                      </td>
                      <td className="action">
                        <Button variant="secondary">
                          Check
                          <ExternalLink size={16} />
                        </Button>
                      </td>
                      <td className="action">
                        <Button variant="secondary">
                          Check
                          <ExternalLink size={16} />
                        </Button>
                      </td>
                      <td className="action">
                        <Button variant="secondary">Admit</Button>
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
                  Manual Payment
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
                <thead>
                  <tr className="bg-[#3c3f9e] text-cream">
                    <th>Competition</th>
                    <th>Team Name</th>
                    <th>Payment Proof</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    { comp: "Business", team: "Schutzschtaffel" },
                    { comp: "Essay", team: "Sternritter" },
                    { comp: "Business", team: "Division Zero" },
                  ].map((row, i, arr) => (
                    <tr key={i} className="border-t">
                      <td>{row.comp}</td>
                      <td>{row.team}</td>
                      <td className="action">
                        <Button variant="secondary">
                          Check
                          <ExternalLink size={16} />
                        </Button>
                      </td>
                      <td className="action">
                        <Button variant="secondary">Admit</Button>
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

      <Footer />
    </div>
  );
}
