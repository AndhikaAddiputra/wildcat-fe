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
} from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Team", href: "" },
    { label: "Administration", href: "" },
    { label: "Events", href: "/events" },
    { label: "Submission", href: "/submission" },
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
        activeLink="/submission"
        action={
          <Button variant="outline" size="lg">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        }
      />

      {/* Hero Section */}
      <section className="relative flex pt-36 pb-8 justify-center pt-20">
        <div className="text-left mx-auto w-[80vw]">
          <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Submission
          </h3>
          <p className="">
            Submit your work here!
          </p>
        </div>
      </section>

      <main className=" flex justify-center mx-auto px-6 py-12 min-h-[55vw]">
        <section className="w-[80vw] flex flex-col gap-10">
            <CardLarge className="w-full max-w-full">
              <CardHeader>
                <CardTitle className="w-19/20 mx-auto mb-4 text-[36px] font-semibold text-white">
                  Preliminary Stage
                </CardTitle>
                <div className="w-19/20 h-[425px] mx-auto flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy">
                  <span className="ml-8 my-auto text-navy text-[24px] font-semibold">Extended Abstract*</span>
                  <div className="w-19/20 h-[300px] border-4 border-dashed border-navy rounded-[20px] mx-auto my-auto flex flex-col gap-3 justify-center items-center">
                    <Plus />
                    <span className="font-semibold text-[22px]">Drag and drop your files</span>
                    <span className="font-medium text-[20px]">JPG, PNG, or PDF, up to 1 MB</span>
                    <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-end px-10 pb-10 pt-0">
                <Button variant="primary" size="lg" className="w-19/20 mx-auto">
                  Submit
                </Button>
              </CardFooter>
            </CardLarge>

            <CardLarge className="w-full max-w-full">
              <CardHeader>
                <CardTitle className="w-19/20 mx-auto mb-4 text-[36px] font-semibold text-white">
                  Final Stage
                </CardTitle>
                <div className="flex gap-4">
                  <div className="w-6/13 h-[425px] mx-auto flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy">
                    <span className="ml-8 my-auto text-navy text-[24px] font-semibold">Full Paper*</span>
                    <div className="w-19/20 h-[300px] border-4 border-dashed border-navy rounded-[20px] mx-auto my-auto flex flex-col gap-3 justify-center items-center">
                      <Plus />
                      <span className="font-semibold text-[22px]">Drag and drop your files</span>
                      <span className="font-medium text-[20px]">JPG, PNG, or PDF, up to 1 MB</span>
                      <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                    </div>
                  </div>
                  <div className="w-6/13 h-[425px] mx-auto flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy">
                    <span className="ml-8 my-auto text-navy text-[24px] font-semibold">Poster*</span>
                    <div className="w-19/20 h-[300px] border-4 border-dashed border-navy rounded-[20px] mx-auto my-auto flex flex-col gap-3 justify-center items-center">
                      <Plus />
                      <span className="font-semibold text-[22px]">Drag and drop your files</span>
                      <span className="font-medium text-[20px]">JPG, PNG, or PDF, up to 1 MB</span>
                      <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex justify-end px-10 pb-10 pt-0">
                <Button variant="primary" size="lg" className="w-19/20 mx-auto">
                  Submit
                </Button>
              </CardFooter>
            </CardLarge>
        </section>
      </main>

      <Footer />
    </div>
  );
}
