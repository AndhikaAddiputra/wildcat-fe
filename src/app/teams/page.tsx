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
import { LOGO, PARTICIPANT_NAV_LINKS, PARTICIPANT_NAV_ACTION } from "@/config/navbar-config";
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
  Calendar,
  MapPin,
  Circle,
  ImageOff,
} from "lucide-react";

export default function Teams() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[url(/background-hero-still.svg)] bg-cover text-white">
      <Navbar
        logo={LOGO}
        links={PARTICIPANT_NAV_LINKS}
        activeLink="/teams"
        action={PARTICIPANT_NAV_ACTION}
        mobileAction={PARTICIPANT_NAV_ACTION}
      />

      {/* Hero Section */}
      <section
        className="relative flex pt-36 pb-8 justify-center pt-20"
      >
        <div className="text-left mx-auto w-[80vw]">
          <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Team&apos;s Profile
          </h3>
          <p className="text-2xl font-semibold text-[#F1E1B4]">
            Manage Your Team&apos;s Data & Information
          </p>
        </div>
      </section>

      <main className="flex justify-center mx-auto px-6 py-12 min-h-[55vw]">
        <section className="w-[80vw]">
          <CardLarge className="w-full max-w-full">
            <CardHeader>
              <CardTitle className="text-[28px] font-bold leading-tight !text-[#F1E1B4] mb-6">
                Team Information
              </CardTitle>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Team&apos;s Name*</label>
                  <Input
                    placeholder="Enter your team name here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                  <p className="text-xs text-[#FF5B5B] text-right">*Team's name cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">University</label>
                  <Input
                    placeholder="Enter your university name here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Phone Number (WhatsApp Available)</label>
                  <Input
                    placeholder="Enter your phone number here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Line ID</label>
                  <Input
                    placeholder="Enter your LINE ID here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
              </div>

              <CardTitle className="text-[28px] font-bold leading-tight !text-[#F1E1B4] mb-6 mt-8">
                Members
              </CardTitle>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Leader&apos;s Name</label>
                  <Input
                    placeholder="Enter leader's name here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Major</label>
                  <Input
                    placeholder="Enter leader's major here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Member 1</label>
                  <Input
                    placeholder="Enter member&apos;s name here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Major</label>
                  <Input
                    placeholder="Enter member&apos;s major here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Member 2</label>
                  <Input
                    placeholder="Enter member&apos;s name here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F1E1B4]">Major</label>
                  <Input
                    placeholder="Enter member&apos;s major here"
                    className="!h-11 !rounded-xl !border !border-[#f1e1b4] !bg-white/10 !text-[#f1e1b4] placeholder:!text-[#f1e1b4]/60 !focus:ring-[#F6911E] !focus:ring-offset-0"
                  />
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-center px-10 pb-10 pt-4">
              <Button variant="primary" size="lg" className="w-[100%]">
                Save Changes
              </Button>
            </CardFooter>
          </CardLarge>
        </section>
      </main>

      <Footer />
    </div>
  );
}

