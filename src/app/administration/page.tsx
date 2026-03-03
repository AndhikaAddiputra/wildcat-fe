"use client";

import { useState } from "react";
import {
  Button,
  CardLarge,
  CardHeader,
  CardTitle,
  CardFooter,
  Navbar,
  Footer,
} from "@/components/ui";
import {
  LogIn,
  Plus,
} from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Team", href: "" },
    { label: "Administration", href: "/administration" },
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
        activeLink="/administration"
        action={
          <Button variant="outline" size="lg">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        }
      />

      {/* Hero Section */}
      <section className="relative flex pt-32 pb-8 justify-center">
        <div className="text-left mx-auto w-[80vw]">
          <h3 className="text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Administration
          </h3>
          <p className="">
            Complete the registration process here!
          </p>
        </div>
      </section>

      <main className="flex justify-center mx-auto px-6 py-12 min-h-[55vw]">
        <section className="w-[80vw] flex flex-col gap-10">
            <CardLarge className="w-full max-w-full h-[1139px]">
              <CardHeader>
                <CardTitle className="w-19/20 mx-auto my-8 text-[36px] font-semibold text-white">
                  1. Upload Documents
                </CardTitle>
                <div className="w-19/20 h-[425px] mx-auto flex flex-col my-auto rounded-[20px] bg-[#9aa0d6] text-navy">
                  <span className="ml-8 my-4 text-navy text-[24px] font-semibold">Kartu Tanda Mahasiswa/Pelajar</span>
                  <div className="grid grid-cols-3 gap-3 mx-auto w-19/20">
                    <span>Team's Leader*</span>
                    <span>Member 1</span>
                    <span>Member 2</span>
                    <div className="h-[300px] w-full border-4 border-dashed border-navy rounded-[20px] mx-auto my-auto flex flex-col gap-3 justify-center items-center">
                        <Plus />
                        <span className="font-semibold text-[22px]">Drag and drop your files</span>
                        <span className="font-medium text-[20px]">JPG, PNG, or PDF, up to 1 MB</span>
                        <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                    </div>
                    <div className="h-[300px] w-full border-4 border-dashed border-navy rounded-[20px] mx-auto my-auto flex flex-col gap-3 justify-center items-center">
                        <Plus />
                        <span className="font-semibold text-[22px]">Drag and drop your files</span>
                        <span className="font-medium text-[20px]">JPG, PNG, or PDF, up to 1 MB</span>
                        <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                    </div>
                    <div className="h-[300px] w-full border-4 border-dashed border-navy rounded-[20px] mx-auto my-auto flex flex-col gap-3 justify-center items-center">
                        <Plus />
                        <span className="font-semibold text-[22px]">Drag and drop your files</span>
                        <span className="font-medium text-[20px]">JPG, PNG, or PDF, up to 1 MB</span>
                        <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                    </div>
                  </div>
                </div>
                <div className="w-19/20 mx-auto flex justify-between my-4">
                  <div className="w-12/25 h-[425px] flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy">
                    <span className="ml-8 my-auto text-navy text-[24px] font-semibold">Full Paper*</span>
                    <div className="w-19/20 h-[300px] border-4 border-dashed border-navy rounded-[20px] mx-auto my-auto flex flex-col gap-3 justify-center items-center">
                      <Plus />
                      <span className="font-semibold text-[22px]">Drag and drop your files</span>
                      <span className="font-medium text-[20px]">JPG, PNG, or PDF, up to 1 MB</span>
                      <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                    </div>
                  </div>
                  <div className="w-12/25 h-[425px] flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy">
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
              <CardFooter className="flex w-19/20 mx-auto">
                <Button variant="primary" size="lg" className="w-full mx-auto">
                  Submit
                </Button>
              </CardFooter>
            </CardLarge>

            <CardLarge className="w-full max-w-full h-[806px]">
              <CardHeader>
                <CardTitle className="w-19/20 mx-auto my-6 text-[36px] font-semibold text-white">
                  2. Payment Information
                </CardTitle>
                <Button variant="primary" size="lg" className="w-19/20 mx-auto">
                  Pay Faster With Midtrans
                </Button>

                <span className="w-19/20 my-8 mx-auto text-center text-cream">
                    --------------------------------------------------------------------- or ---------------------------------------------------------------------
                </span>
                
                <span className="w-19/20 mx-auto text-center text-cream">
                    Manual payment with transfer through this bank account:
                </span>
                <span className="w-19/20 mb-8 mx-auto text-center text-cream font-semibold">
                    1234-5678-69 (Bank Cahaya Asia - Charlie Kirk)
                </span>

                <div className="w-19/20 h-[300px] mx-auto flex flex-col rounded-[20px] border-4 border-dashed border-navy bg-[#9aa0d6] text-navy">
                    <div className="w-19/20 h-[300px] rounded-[20px] mx-auto my-auto flex flex-col gap-3 justify-center items-center">
                        <Plus />
                        <span className="font-semibold text-[22px]">Drag and drop your files</span>
                        <span className="font-medium text-[20px]">JPG, PNG, or PDF, up to 1 MB</span>
                        <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                    </div>
                </div>
              </CardHeader>
              <CardFooter className="w-19/20 mx-auto my-auto">
                <Button variant="outline" size="lg" className="w-full border-2 border-orange text-orange">Verify</Button>
              </CardFooter>
            </CardLarge>
        </section>
      </main>

      <Footer />
    </div>
  );
}
