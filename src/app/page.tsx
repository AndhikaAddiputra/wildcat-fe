"use client";

import { useState } from "react";
import {
  Button,
  Card,
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
                <CardTitle>Secure by Default</CardTitle>
                <CardDescription>
                  Built with security best practices and type safety in mind.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <Zap className="h-5 w-5 text-green-400" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Optimized for performance with server-side rendering.
                </CardDescription>
              </CardHeader>
            </Card>

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
            </Card>
          </div>

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
