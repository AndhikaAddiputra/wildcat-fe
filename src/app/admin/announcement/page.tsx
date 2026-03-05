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
  Pencil,
  SquareSlash,
} from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Access Control", href: "/admin/access" },
    { label: "Announcement", href: "/admin/announcement" },
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
        activeLink="/admin/announcement"
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
            Access Control
          </h3>
          <p className="">
            Grant access and control accounts limitation here
          </p>
        </div>
      </section>

      <main className="flex justify-center mx-auto py-12 min-h-[55vw]">
        <section className="w-[80%]">
          <div className="flex flex-col justify-center bg-navy rounded-[20px] p-12">
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h4 className="font-semibold text-[36px] text-cream">
                  Make Announcement
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
          </div>

          <div className="flex flex-row justify-between items-center bg-[#9aa0d6] rounded-[20px] p-8 mt-8">
            <div>
                <SquareSlash size={48} color="#0b2e6f" />
            </div>
            <div className="mx-8 text-navy">
                <span className="text-[24px] font-semibold">Pengumuman Hasil Competition</span>
                <p>
                    Lorem ipsum dolor si amet Lorem ipsum dolor si amet  Lorem ipsum dolor si amet  Lorem ipsum dolor si amet  Lorem ipsum dolor si amet  Lorem ipsum dolor si amet  Lorem ipsum dolor si amet  Lorem ipsum dolor si amet  Lorem ipsum dolor si amet...
                </p>
            </div>
            <div>
                <Button variant="secondary" size="md">
                    Edit
                    <Pencil size={16} />
                </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
