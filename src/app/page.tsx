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
  Trash2,
  Plus,
  Download,
  Share2,
  Zap,
  Shield,
  Globe,
  Rocket,
  Copy,
} from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

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

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <Badge variant="info" className="mb-4">
            <Rocket className="mr-1 h-3 w-3" />
            v0.1.0
          </Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Wildcat Component Library
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Reusable React components built with Next.js, Tailwind CSS, and Lucide icons.
            Beautiful, accessible, and ready to use.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              <Globe className="h-4 w-4" />
              Documentation
            </Button>
          </div>
        </section>

        <Separator className="mb-12" />

        {/* Buttons Section */}
        <section id="components" className="mb-16">
          <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Buttons
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Button variants and sizes for every use case.
          </p>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <p className="mb-3 text-sm font-medium text-zinc-500">Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="mb-6">
                <p className="mb-3 text-sm font-medium text-zinc-500">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <p className="mb-3 text-sm font-medium text-zinc-500">With Icons</p>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="secondary">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline">
                    <Plus className="h-4 w-4" />
                    Create New
                  </Button>
                  <Button variant="danger">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Competition Cards
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Custom card designs based on Figma layout.
          </p>

          <div className="flex flex-col gap-10">
            {/* Card Small */}
            <CardSmall>
              <CardHeader className="p-10">
                <div className="flex justify-between items-start mb-6">
                  <CardTitle className="text-[36px] font-semibold text-[#F1E1B4] leading-[54px]">
                    [Competition_Full Name]
                  </CardTitle>
                  
                  <div
                    className="w-[80px] h-[80px] border-[7px] shrink-0"
                    style={{
                      borderColor: '#F6911E',
                      backgroundImage: `linear-gradient(to bottom right, transparent calc(50% - 3px), #F6911E calc(50% - 3px), #F6911E calc(50% + 3px), transparent calc(50% + 3px))`
                    }}
                  >
                  </div>
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

            {/* Card Medium */}
            <CardMedium>
              <CardHeader className="p-10 pb-6">
                <div 
                  className="border-2 rounded-[20px] mb-6 flex items-center justify-center gap-[10px]"
                  style={{ 
                    width: '200px', 
                    height: '40px', 
                    borderColor: '#34C759', 
                    color: '#34C759' 
                  }}
                >
                  <div className="w-[10px] h-[10px] rounded-full bg-[#34C759]"></div>
                    <span className="font-['Manrope'] font-bold text-[16px] tracking-wide">
                      AVAILABLE
                    </span>
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

            {/* Card Large */}
            <CardLarge>
              <CardHeader className="p-10">
                <CardTitle className="text-[36px] font-semibold text-[#F1E1B4] leading-tight">
                  [FullPage_Card]
                </CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="success">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Success
                  </Badge>
                  <Badge variant="warning">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Warning
                  </Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">
                    <Info className="mr-1 h-3 w-3" />
                    Info
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avatars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar fallback="WC" size="sm" />
                  <Avatar fallback="JD" size="md" />
                  <Avatar fallback="AB" size="lg" />
                  <Avatar
                    src="https://api.dicebear.com/9.x/initials/svg?seed=WC"
                    alt="User avatar"
                    size="md"
                  />
                  <Avatar
                    src="https://api.dicebear.com/9.x/initials/svg?seed=JD"
                    alt="User avatar"
                    size="lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Icons Showcase */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Lucide Icons
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            1000+ free, open-source icons from Lucide. Easily customizable with size and color.
          </p>

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
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
                  { Icon: Settings, name: "Gear" },
                ].map(({ Icon, name }, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 rounded-lg p-3 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px]">{name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Forms Section */}
        <section id="forms" className="mb-16">
          <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Form Elements
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Input components with labels, validation, and accessibility.
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>An example form with inputs and textarea.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <Input
                    id="name"
                    label="Full Name"
                    placeholder="Enter your name"
                  />
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                  />
                  <Input
                    id="error-demo"
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    error="Password must be at least 8 characters"
                  />
                  <Textarea
                    id="message"
                    label="Message"
                    placeholder="Write your message here..."
                    rows={4}
                  />
                  <Button className="w-full sm:w-auto">
                    <Mail className="h-4 w-4" />
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
                <Button onClick={() => setModalOpen(true)}>
                  Open Modal
                </Button>

                <Modal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="Confirm Action"
                  description="Are you sure you want to proceed? This action cannot be undone."
                >
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setModalOpen(false)}>
                      Confirm
                    </Button>
                  </div>
                </Modal>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Separator Demo */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Separator
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            Visual dividers between sections.
          </p>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Content above the separator</p>
              <Separator className="my-4" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Content below the separator</p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Wildcat Frontend &mdash; Built with Next.js, Tailwind CSS & Lucide Icons
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="success">
              <CheckCircle className="mr-1 h-3 w-3" />
              Ready
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
