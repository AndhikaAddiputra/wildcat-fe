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

export default function Event() {
  const [modalOpen, setModalOpen] = useState(false);

  const navLinks = [
    { label: "About", href: "/" },
    { label: "Competitions", href: "#components" },
    { label: "Events", href: "/events" },
    { label: "Timeline", href: "#badges" },
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');`}</style>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Poppins:wght@400;600;700&display=swap');`}</style>
      {/* Navbar - transparent to solid */}
      <Navbar
        logo={
          <img src="/wildcat-logo.svg" alt="Wildcat" className="h-20 w-auto" />
        }
        links={navLinks}
        activeLink="/events"
        action={
          <Button variant="outline" size="lg">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        }
      />

      {/* Hero Section */}
      <section
        className="relative flex pt-36 pb-8 justify-center bg-gradient-to-b from-[#0A2D6E]/60 to-zinc-900 pt-20"
      >
        <div className="text-left mx-auto w-[80vw]">
          <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Events
          </h3>
          <p className="">
            Explore our exciting events!
          </p>
        </div>
      </section>

      <main className=" flex justify-center mx-auto px-6 py-12 min-h-[55vw]">
        <section className="w-[80vw]">
            <CardMedium>
              <CardHeader>
                <Badge variant="complete" className="mb-4">
                  AVAILABLE
                </Badge>
                <CardTitle className="mb-4 text-[36px] font-semibold leading-tight text-white">
                  [Event_FullName]
                </CardTitle>
                <CardDescription className="text-justify leading-relaxed text-[#F1E1B4] text-[20px] opacity-100">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-end px-10 pb-10 pt-0">
                <Button variant="primary" size="lg">
                  Learn More
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </CardFooter>
            </CardMedium>
        </section>
      </main>

      <Footer />
    </div>
  );
}
