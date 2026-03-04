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
import { LOGO, PARTICIPANT_NAV_LINKS, PARTICIPANT_NAV_ACTION } from "@/config/navbar-config";
import { Plus } from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[url(/background-hero-still.svg)] bg-cover text-white">
      <Navbar
        logo={LOGO}
        links={PARTICIPANT_NAV_LINKS}
        activeLink="/administration"
        action={PARTICIPANT_NAV_ACTION}
        mobileAction={PARTICIPANT_NAV_ACTION}
      />

      {/* Hero Section */}
      <section className="relative flex pt-36 pb-8 justify-center pt-20 px-4">
        <div className="w-full max-w-6xl mx-auto text-left">
          <h3 className="text-3xl sm:text-4xl md:text-[48px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-yellow-400">
            Administration
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#F1E1B4]">
            Complete the registration process here!
          </p>
        </div>
      </section>

      <main className="flex justify-center mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-0">
        <section className="w-full max-w-6xl flex flex-col gap-8 sm:gap-10">
            <CardLarge className="w-full max-w-full min-h-0">
              <CardHeader className="p-4 sm:p-6 md:p-8">
                <CardTitle className="w-full max-w-[95%] mx-auto my-6 sm:my-8 text-2xl sm:text-[32px] font-semibold !text-[#F1E1B4]">
                  1. Upload Documents
                </CardTitle>
                <div className="w-full max-w-[95%] mx-auto flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4 sm:p-6">
                  <span className="ml-2 sm:ml-8 my-3 sm:my-4 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Kartu Tanda Mahasiswa/Pelajar</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 w-full">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm sm:text-base font-medium">Team&apos;s Leader*</span>
                      <div className="min-h-[240px] sm:min-h-[280px] lg:min-h-[300px] w-full border-4 border-dashed border-navy rounded-[20px] flex flex-col gap-2 sm:gap-3 justify-center items-center p-4">
                        <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                        <span className="font-semibold text-base sm:text-lg md:text-[22px] text-center">Drag and drop your files</span>
                        <span className="font-medium text-sm sm:text-[20px] text-center">JPG, PNG, or PDF, up to 1 MB</span>
                        <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm sm:text-base font-medium">Member 1</span>
                      <div className="min-h-[240px] sm:min-h-[280px] lg:min-h-[300px] w-full border-4 border-dashed border-navy rounded-[20px] flex flex-col gap-2 sm:gap-3 justify-center items-center p-4">
                        <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                        <span className="font-semibold text-base sm:text-lg md:text-[22px] text-center">Drag and drop your files</span>
                        <span className="font-medium text-sm sm:text-[20px] text-center">JPG, PNG, or PDF, up to 1 MB</span>
                        <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
                      <span className="text-sm sm:text-base font-medium">Member 2</span>
                      <div className="min-h-[240px] sm:min-h-[280px] lg:min-h-[300px] w-full border-4 border-dashed border-navy rounded-[20px] flex flex-col gap-2 sm:gap-3 justify-center items-center p-4">
                        <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                        <span className="font-semibold text-base sm:text-lg md:text-[22px] text-center">Drag and drop your files</span>
                        <span className="font-medium text-sm sm:text-[20px] text-center">JPG, PNG, or PDF, up to 1 MB</span>
                        <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-[95%] mx-auto flex flex-col md:flex-row md:justify-between gap-4 my-4">
                  <div className="w-full md:w-[48%] min-h-[320px] md:min-h-[425px] flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                    <span className="ml-2 sm:ml-8 my-3 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Full Paper*</span>
                    <div className="flex-1 min-h-[240px] w-full max-w-[95%] mx-auto border-4 border-dashed border-navy rounded-[20px] flex flex-col gap-2 sm:gap-3 justify-center items-center p-4">
                      <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                      <span className="font-semibold text-base sm:text-lg md:text-[22px] text-center">Drag and drop your files</span>
                      <span className="font-medium text-sm sm:text-[20px] text-center">JPG, PNG, or PDF, up to 1 MB</span>
                      <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                    </div>
                  </div>
                  <div className="w-full md:w-[48%] min-h-[320px] md:min-h-[425px] flex flex-col rounded-[20px] bg-[#9aa0d6] text-navy p-4">
                    <span className="ml-2 sm:ml-8 my-3 text-navy text-lg sm:text-xl md:text-[24px] font-semibold">Poster*</span>
                    <div className="flex-1 min-h-[240px] w-full max-w-[95%] mx-auto border-4 border-dashed border-navy rounded-[20px] flex flex-col gap-2 sm:gap-3 justify-center items-center p-4">
                      <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                      <span className="font-semibold text-base sm:text-lg md:text-[22px] text-center">Drag and drop your files</span>
                      <span className="font-medium text-sm sm:text-[20px] text-center">JPG, PNG, or PDF, up to 1 MB</span>
                      <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex w-full max-w-[95%] mx-auto p-4 sm:p-6">
                <Button variant="primary" size="lg" className="w-full mx-auto">
                  Submit
                </Button>
              </CardFooter>
            </CardLarge>

            <CardLarge className="w-full max-w-full min-h-0">
              <CardHeader className="p-4 sm:p-6 md:p-8">
                <CardTitle className="w-full max-w-[95%] mx-auto my-4 sm:my-6 text-2xl sm:text-[32px] font-semibold !text-cream">
                  2. Payment Information
                </CardTitle>
                <Button variant="primary" size="lg" className="w-full max-w-[95%] mx-auto">
                  Pay Faster With Mayar.id
                </Button>

                <span className="w-full max-w-[95%] my-6 sm:my-8 mx-auto text-center text-cream text-sm sm:text-base">
                    -------------------- OR --------------------
                </span>

                <span className="w-full max-w-[95%] mx-auto text-center text-cream text-sm sm:text-base">
                    Manual payment with transfer through this bank account:
                </span>
                <span className="w-full max-w-[95%] mb-6 sm:mb-8 mx-auto text-center text-cream font-semibold text-sm sm:text-base">
                   0015 3032 3351 (BLU BCA DIGITAL - ALMA ZIKRA SYAFIA)
                </span>

                <div className="w-full max-w-[95%] min-h-[240px] sm:min-h-[300px] mx-auto flex flex-col rounded-[20px] border-4 border-dashed border-navy bg-[#9aa0d6] text-navy p-4">
                    <div className="flex-1 min-h-[200px] rounded-[20px] flex flex-col gap-2 sm:gap-3 justify-center items-center">
                        <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                        <span className="font-semibold text-base sm:text-lg md:text-[22px] text-center">Drag and drop your files</span>
                        <span className="font-medium text-sm sm:text-[20px] text-center">JPG, PNG, or PDF, up to 1 MB</span>
                        <Button variant="outline" size="md" className="text-navy border-navy">Select File</Button>
                    </div>
                </div>
              </CardHeader>
              <CardFooter className="w-full max-w-[95%] mx-auto my-auto p-4 sm:p-6">
                <Button variant="outline" size="lg" className="w-full border-2 border-orange text-orange">Verify</Button>
              </CardFooter>
            </CardLarge>
        </section>
      </main>

      <Footer />
    </div>
  );
}
