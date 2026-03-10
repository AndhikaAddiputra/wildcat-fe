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
import { LOGO, ADMIN_NAV_LINKS, ADMIN_NAV_ACTION } from "@/config/navbar-config";
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
  Pencil,
} from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <div className="relative flex-1 bg-[url(/background-hero-still.svg)] bg-cover">
        <Navbar
        logo={LOGO}
        links={ADMIN_NAV_LINKS}
        activeLink="/admin/access"
        action={ADMIN_NAV_ACTION}
        mobileAction={ADMIN_NAV_ACTION}
      />

      {/* Hero Section */}
      <section className="relative flex pt-32 mx-auto w-[80%] items-center">
        <div className="text-left">
          <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Access Control
          </h3>
          <p className="text-2xl font-semibold text-[#F1E1B4]">
            Grant access and control accounts limitation here
          </p>
        </div>
      </section>

      <main className="flex flex-1 justify-center mx-auto py-12 min-h-[55vw]">
        <section className="w-[80%]">
          <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h4 className="font-semibold text-[36px] text-cream">
                  Commitee's Accounts
                </h4>
              </div>
              <div className="flex justify-between w-[560px]">
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  <Plus size={16} strokeWidth={3} />
                  New
                </Button>
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
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "17%" }} />
                  <col style={{ width: "17%" }} />
                </colgroup>
                <thead>
                  <tr className="text-white">
                    <th>Account Created</th>
                    <th>Gmail Account</th>
                    <th>Role</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    { date: "18/03/2026 08:14:10", mail: "diddy@gmail.com" },
                    { date: "18/03/2026 08:14:12", mail: "epstein@gmail.com" },
                    { date: "18/03/2026 08:14:15", mail: "trevor@gmail.com" },
                  ].map((row, i, arr) => (
                    <tr key={i} className="border-t">
                      <td>{row.date}</td>
                      <td>{row.mail}</td>
                      <td className="action">
                        <Badge variant="verified" className="bg-transparent text-navy border-navy">Commitee</Badge>
                      </td>
                      <td className="action">
                        <Button variant="secondary">
                          Edit
                          <Pencil size={16} />
                        </Button>
                      </td>
                      <td className="action">
                        <Button variant="secondary" className="bg-red">
                          Delete
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

          <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12 mt-8">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h4 className="font-semibold text-[36px] text-cream">
                  Participant's Accounts
                </h4>
              </div>
              <div className="flex justify-between w-[560px]">
                <Button variant="primary" size="lg" className="min-w-[180px]">
                  <Plus size={16} strokeWidth={3} />
                  New
                </Button>
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
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "17%" }} />
                  <col style={{ width: "17%" }} />
                </colgroup>
                <thead>
                  <tr className="text-white">
                    <th>Account Created</th>
                    <th>Gmail Account</th>
                    <th>Status</th>
                    <th>Phone Number</th>
                    <th>Line ID</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    { date: "18/03/2026 08:14:10", mail: "diddy@gmail.com", phone: "081212123434", line: "baby_oiler" },
                    { date: "18/03/2026 08:14:12", mail: "epstein@gmail.com", phone: "081212123434", line: "touchy_hand" },
                    { date: "18/03/2026 08:14:15", mail: "trevor@gmail.com", phone: "081212123434", line: "sugar_sniffer" },
                  ].map((row, i, arr) => (
                    <tr key={i} className="border-t">
                      <td>{row.date}</td>
                      <td>{row.mail}</td>
                      <td className="action">
                        <Badge variant="complete">Paid</Badge>
                      </td>
                      <td className="action">{row.phone}</td>
                      <td className="action">{row.line}</td>
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
