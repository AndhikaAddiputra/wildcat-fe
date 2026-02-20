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
  Trash2,
  Plus,
  Download,
  Share2,
  Zap,
  Shield,
  Globe,
  Rocket,
  Circle,
} from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Competitions", href: "#components" },
    { label: "Events", href: "#buttons" },
    { label: "Timeline", href: "#badges" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');`}</style>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Poppins:wght@400;600;700&display=swap');`}</style>
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Wildcat
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#components" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Components
            </a>
            <a href="#icons" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Icons
            </a>
            <a href="#forms" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Forms
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Avatar fallback="WC" size="sm" />
          </div>
        </div>
      </header>
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Navbar - transparent to solid */}
      <Navbar
        logo={
          <img src="/wildcat-logo.svg" alt="Wildcat" className="h-20 w-auto" />
        }
        links={navLinks}
        activeLink="#about"
        action={
          <Button variant="outline" size="lg">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        }
      />

      {/* Hero Section */}
      <section
        id="about"
        className="relative flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-[#0A2D6E]/60 to-zinc-900 pt-20"
      >
        <div className="text-center">
          <Badge variant="verified" className="mb-4">
            <Rocket className="mr-1 h-3 w-3" />
            v0.1.0
          </Badge>
          <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
            Wildcat Component Library
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
            Reusable React components built with Next.js, Tailwind CSS, and Lucide icons.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="sm">Get Started</Button>
            <Button variant="outline" size="sm">
              Documentation
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* ── Primary Button ── */}
        <section id="buttons" className="mb-16">
          <h2 className="mb-1 text-3xl font-bold">Buttons & Label</h2>
          <p className="mb-8 text-sm text-zinc-400">Rounding = 20</p>

          <h3 className="mb-1 text-xl font-bold">Primary Button</h3>
          <p className="mb-6 text-sm text-zinc-400">
            Perhatikan Height dari button-nya karena seragam yaitu 70px. Untuk warna dapat berubah-ubah sesuai primary color
          </p>

          {/* Primary Filled - Large */}
          <div className="mb-3">
            <p className="mb-2 text-xs text-zinc-500">Primary Button (Filled)</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Button</Button>
              <Button variant="primary" size="lg">Button</Button>
              <Button
                variant="primary"
                size="lg"
              >
                Button
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="min-w-[300px]"
              >
                Button
              </Button>
            </div>
          </div>

          {/* Primary Outline - Large */}
          <div className="mb-3">
            <p className="mb-2 text-xs text-zinc-500">Primary Button (Outline)</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline">Button</Button>
              <Button variant="outline" size="lg">Button</Button>
              <Button
                variant="outline"
                size="lg"
              >
                Button
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[300px]"
              >
                Button
              </Button>
            </div>
          </div>

          {/* Primary Filled - Small */}
          <div className="mb-8">
            <p className="mb-2 text-xs text-zinc-500">Primary Button (Small)</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Button</Button>
              <Button size="sm" variant="primary">Button</Button>
              <Button
                size="sm"
                variant="primary"
              >
                Button
              </Button>
              <Button
                size="sm"
                variant="primary"
                className="min-w-[300px]"
              >
                Download Guidebook
              </Button>
            </div>
          </div>

          <Separator className="my-8 bg-zinc-800" />

          {/* ── Secondary Button ── */}
          <h3 className="mb-1 text-xl font-bold">Secondary Button</h3>
          <p className="mb-6 text-sm text-zinc-400">
            Height seragam = 50px, style semua seragam.
          </p>

          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="sm">
              Button
              <Circle className="h-3 w-3 fill-current" />
            </Button>
            <Button variant="secondary" size="sm">
              Button
              <Circle className="h-3 w-3 fill-current" />
            </Button>
          </div>

          <Separator className="my-8 bg-zinc-800" />

          {/* ── Status Label / Badges ── */}
          <section id="badges">
            <h3 className="mb-1 text-xl font-bold">Status Label / Badges</h3>
            <p className="mb-6 text-sm text-zinc-400">
              Height seragam = 40px, style semua seragam.
            </p>

            <div className="flex flex-wrap gap-2 mb-0.5">
              <Badge variant="pending">Registered</Badge>
              <Badge variant="verified">Verified</Badge>
              <Badge variant="complete">Paid</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-0.5">
              <Badge variant="pending">Registered</Badge>
              <Badge variant="verified">Verified</Badge>
              <Badge variant="complete">Paid</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-0.5">
              <Badge variant="end">EVENT ENDED</Badge>
              <Badge variant="pending">NOT YET STARTED</Badge>
              <Badge variant="complete">AVAILABLE</Badge>
            </div>
          </section>
        </section>

        <Separator className="my-8 bg-zinc-800" />

        {/* ── Other Components ── */}
        <section id="components" className="mb-16">
          <h2 className="mb-6 text-3xl font-bold">Other Components</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                
                <CardDescription className="text-justify leading-relaxed text-[#F1E1B4] opacity-100 text-[20px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="flex justify-end px-10 pb-10 pt-0">
                <button className="bg-[#F6911E] text-[#0A2D6E] px-8 py-3 rounded-[20px] flex items-center gap-3 hover:opacity-90 transition-opacity font-['Manrope'] font-bold text-[20px]">
                  Learn More
                  <Copy className="w-[23px] h-[23px] stroke-[2px]" />
                </button>
              </CardFooter>
            </CardSmall>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <Zap className="h-5 w-5 text-green-400" />
                </div>
                
                <CardTitle className="mb-4 text-[36px] font-semibold text-[#F1E1B4] leading-tight">
                  [Event_FullName]
                </CardTitle>
                
                <CardDescription className="text-justify leading-relaxed text-[#F1E1B4] opacity-100 text-[20px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="flex justify-end px-10 pb-10 pt-0">
                <button className="bg-[#F6911E] text-[#0A2D6E] px-8 py-3 rounded-[20px] flex items-center gap-3 hover:opacity-90 transition-opacity font-['Manrope'] font-bold text-[20px]">
                  Learn More
                  <Copy className="w-[23px] h-[23px] stroke-[2px]" />
                </button>
              </CardFooter>
            </CardMedium>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <Globe className="h-5 w-5 text-blue-400" />
                </div>
                <CardTitle>Fully Responsive</CardTitle>
                <CardDescription>
                  Components that look great on any screen size.
                </CardDescription>
              </CardHeader>
            </CardLarge>
          </div>
        </section>

        {/* Badges & Avatars */}
        <section id="icons" className="mb-16">
          <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Badges & Avatars
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Status indicators and user representations.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">

          {/* Forms */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>An example form with inputs and textarea.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <Input id="name" label="Full Name" placeholder="Enter your name" />
                  <Input id="email" label="Email" type="email" placeholder="you@example.com" />
                  <Textarea id="message" label="Message" placeholder="Write your message here..." rows={3} />
                  <Button size="sm" variant="primary">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modal Dialog</CardTitle>
                <CardDescription>Open a modal overlay with any content.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" onClick={() => setModalOpen(true)}>
                  Open Modal
                </Button>

                <Modal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="Confirm Action"
                  description="Are you sure you want to proceed? This action cannot be undone."
                >
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setModalOpen(false)}>
                      Confirm
                    </Button>
                  </div>
                </Modal>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Icons Showcase */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold">Lucide Icons</h2>
          <p className="mb-6 text-sm text-zinc-400">
            1000+ free, open-source icons from Lucide. Easily customizable with size and color.
          </p>

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-5 gap-4 sm:grid-cols-7 md:grid-cols-10">
                {[
                  { Icon: Heart, name: "Heart" },
                  { Icon: Star, name: "Star" },
                  { Icon: Search, name: "Search" },
                  { Icon: Bell, name: "Bell" },
                  { Icon: Settings, name: "Settings" },
                  { Icon: User, name: "User" },
                  { Icon: Mail, name: "Mail" },
                  { Icon: ArrowRight, name: "Arrow" },
                  { Icon: CheckCircle, name: "Check" },
                  { Icon: AlertTriangle, name: "Alert" },
                  { Icon: Info, name: "Info" },
                  { Icon: Trash2, name: "Trash" },
                  { Icon: Plus, name: "Plus" },
                  { Icon: Download, name: "Download" },
                  { Icon: Share2, name: "Share" },
                  { Icon: Zap, name: "Zap" },
                  { Icon: Shield, name: "Shield" },
                  { Icon: Globe, name: "Globe" },
                  { Icon: Rocket, name: "Rocket" },
                  { Icon: Circle, name: "Circle" },
                ].map(({ Icon, name }, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 rounded-lg p-3 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px]">{name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
