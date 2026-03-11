"use client";

import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr'; // Gunakan Supabase Client untuk di browser

/** Map competition display name (step 3) to competition ID for API */
const COMPETITION_NAME_TO_ID: Record<string, string> = {
  "Paper & Poster": "paper-poster",
  "Business Case": "business-case",
  "GnG Case Study": "gng-case",
  "Essay": "high-school-essay",
};

export interface RegistrationFormData {
  teamName: string;
  leaderFullName: string;
  university: string;
  major: string;
  competitionId: string;
}

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  
  // State untuk menyimpan data form
  const [teamName, setTeamName] = useState("");
  const [leadName, setLeadName] = useState("");
  const [institution, setInstitution] = useState("");
  const [leadMajor, setLeadMajor] = useState("");
  const [selectedComp, setSelectedComp] = useState("");
  
  // State untuk loading saat submit
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const stepNumber = parseInt(stepParam);
      if (stepNumber >= 1 && stepNumber <= 3) {
        setStep(stepNumber);
      }
    }
  }, [searchParams]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      window.location.href = "/landing";
    }
  };

  // Fungsi Login Google (Untuk Step 1)
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Arahkan kembali ke halaman callback kita yang kemarin diperbaiki
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Error logging in:", error);
    }
  };

  // Fungsi Submit Data ke Backend Hono (Untuk Step 3)
  const handleSubmitRegistration = async () => {
    setIsLoading(true);
    try {
      const { data: authData } = await supabase.auth.getSession();
      const accessToken = authData.session?.access_token;

      if (!accessToken) {
        toast.error("Your session has expired. Please log in again.");
        setStep(1);
        return;
      }

      const payload = {
        competitionId: selectedComp,
        teamName,
        leadName,
        institution,
        leadMajor
      };

      // Gunakan proxy same-origin untuk menghindari CORS dan "Load failed"
      const doRequest = () =>
        fetch('/api/landing/register/step1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload),
          credentials: 'include'
        });

      let response = await doRequest();

      // Jika gagal pertama kali (mis. query competitions cold start), coba sekali lagi
      if (!response.ok) {
        await new Promise((r) => setTimeout(r, 600));
        response = await doRequest();
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData?.error || errorData?.message || "Registration failed";
        const isDbError = typeof msg === 'string' && (msg.includes('competitions') || msg.includes('Failed query') || msg.includes('select '));
        throw new Error(isDbError ? "Database connection busy. Please click Submit again." : msg);
      }

      window.location.href = "/home";
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3C3C9C] to-[#96A0D2] relative flex items-center justify-center p-6 font-['Poppins']">      
      <button 
        onClick={handleBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-[#F6911E] text-[20px] font-bold hover:opacity-80 transition-opacity z-10"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        <ArrowLeft className="w-[37px] h-[37px]" /> Back
      </button>

      <div className="max-w-[1250px] w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-[80px]">
        {/* Kolom Kiri: Banner */}
        <div className="relative shrink-0 w-full max-w-[387px] h-[286px]">
          <Image 
            src="/Banner.svg" 
            alt="Wildcat Banner"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Kolom Kanan: Form Box */}
        <div className="w-full max-w-[592px] h-auto min-h-[450px] md:h-[613px] bg-[#0A2D6E] rounded-[20px] p-8 sm:p-[40px] shadow-[0_0_40px_10px_rgba(246,145,30,0.5)] flex flex-col items-center relative overflow-y-auto"><h2 
            className="text-[36px] font-semibold text-[#F6911E]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {step === 3 ? "Choose Competition" : "Register"}
          </h2>

          {/* === STEP 1: LOGIN === */}
          {step === 1 && (
            <div className="w-full flex-1 flex flex-col items-center pt-6">
              <div className="relative w-[329px] h-[235px] shrink-0 mb-6">
                <Image 
                  src="/login_illustration.svg" 
                  alt="Login Illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <p className="text-[#F1E1B4] text-center text-[20px] leading-relaxed font-medium mb-auto px-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Join the competition by signing in with your Google account first.
              </p>
              
              <div className="w-full flex flex-col items-center gap-4 mt-6">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full max-w-[484px] h-[70px] bg-[#F6911E] text-[#0A2D6E] font-bold text-[20px] rounded-[15px] flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-[0px_4px_10px_rgba(0,0,0,0.25)] disabled:opacity-50"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#0A2D6E"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#0A2D6E"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#0A2D6E"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#0A2D6E"/></svg>
                  {isLoading ? "Redirecting..." : "Sign Up With Google"}
                </button>
                
                <p className="text-[#F1E1B4] text-[16px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Already have an account? <Link href="/login" className="text-[#F6911E] font-bold hover:underline">Click Here</Link>
                </p>
              </div>
            </div>
          )}

          {/* === STEP 2: FORM TEAM & LEADER === */}
          {step === 2 && (
            <div className="w-full max-w-[484px] flex-1 flex flex-col pt-2 pb-2">
              <div className="flex flex-col gap-[10px] mb-5">
                <label className="text-[#F1E1B4] text-[16px] font-medium ml-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Team&apos;s Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="E.g. GeoChampions"
                  className="w-full h-[70px] bg-white/10 backdrop-blur-md border-[3px] border-[#F1E1B4] rounded-[20px] px-5 text-white focus:outline-none focus:border-[#F6911E] transition-colors"
                />
              </div>
              
              <div className="flex flex-col gap-[10px] mb-5">
                <label className="text-[#F1E1B4] text-[16px] font-medium ml-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Leader&apos;s Full Name
                </label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-[70px] bg-white/10 backdrop-blur-md border-[3px] border-[#F1E1B4] rounded-[20px] px-5 text-white focus:outline-none focus:border-[#F6911E] transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-[18px]">
                <div className="flex flex-col gap-[10px]">
                  <label className="text-[#F1E1B4] text-[16px] font-medium ml-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    University/ School
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="ITB"
                    className="w-full h-[70px] bg-white/10 backdrop-blur-md border-[3px] border-[#F1E1B4] rounded-[20px] px-5 text-white focus:outline-none focus:border-[#F6911E] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label className="text-[#F1E1B4] text-[16px] font-medium ml-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Major
                  </label>
                  <input
                    type="text"
                    value={leadMajor}
                    onChange={(e) => setLeadMajor(e.target.value)}
                    placeholder="Geology"
                    className="w-full h-[70px] bg-white/10 backdrop-blur-md border-[3px] border-[#F1E1B4] rounded-[20px] px-5 text-white focus:outline-none focus:border-[#F6911E] transition-colors"
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(3)}
                disabled={!teamName || !leadName || !institution || !leadMajor}
                className="w-full h-[70px] bg-[#F6911E] text-[#0A2D6E] font-bold text-[20px] rounded-[15px] mt-auto hover:opacity-90 transition-opacity shadow-[0px_4px_10px_rgba(0,0,0,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Continue
              </button>
            </div>
          )}
          
          {/* === STEP 3: CHOOSE COMPETITION === */}
          {step === 3 && (
            <div className="w-full max-w-[420px] flex-1 flex flex-col pt-[10px] items-center px-2">
              <div className="grid grid-cols-2 gap-3 sm:gap-x-[0px] sm:gap-y-[16px] mb-4 mx-auto w-full justify-items-center">
                {[
                  { 
                    name: "Paper & Poster", 
                    id: "77597754-e64c-402d-a71f-a359a39be953", // ID Real dari DB
                    imageUrl: "/PaPos.png" 
                  },
                  { 
                    name: "Business Case", 
                    id: "9a493de9-4b3f-45f2-aa51-c43d29882738", // ID Real dari DB
                    imageUrl: "/BCC.png" 
                  },
                  { 
                    name: "GnG Case Study", 
                    id: "a1baa39c-5806-42c5-8762-23613344f6fe", // ID Real dari DB
                    // TIPS: Lebih aman jika nama file di folder public diubah menjadi tanpa spasi, misal "GnG_Case_Study.png"
                    imageUrl: "/GnG%20Case%20Study.png" 
                  },
                  { 
                    name: "Essay", 
                    id: "a83cf52f-08fe-47ca-8e43-ae8c1f8b78ce", // ID Real dari DB
                    imageUrl: "/Essay.png" 
                  },
                ].map(({ name, id, imageUrl }) => (
                  <div 
                    key={id} 
                    onClick={() => setSelectedComp(id)}
                    className={`w-full max-w-[145px] sm:max-w-none sm:w-[179px] aspect-square sm:aspect-auto sm:h-[179px] bg-white/10 backdrop-blur-md border-[3px] border-[#F6911E] rounded-[20px] flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer transition-all overflow-hidden
                      ${selectedComp === id ? '!bg-[#F6911E] scale-[1.02] shadow-[0_0_15px_rgba(246,145,30,0.3)]' : 'hover:bg-white/20'}`}
                  >
                    <div className="relative w-[50px] sm:w-[80px] h-[50px] sm:h-[80px] shrink-0 flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <span 
                      className={`text-[13px] sm:text-[16px] font-medium text-center px-2 leading-tight ${selectedComp === id ? 'text-[#0A2D6E]' : 'text-[#F1E1B4]'}`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {name}
                    </span>
                  </div>
                ))}
              </div>

              {submitError && (
                <p className="text-[#FF5B5B] text-sm mt-2 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {submitError}
                </p>
              )}
              <button
                onClick={handleSubmitRegistration}
                disabled={!selectedComp || isLoading}
                className={`w-full max-w-[484px] h-[60px] sm:h-[70px] bg-[#F6911E] text-[#0A2D6E] font-bold text-[18px] sm:text-[20px] rounded-[15px] mt-4 sm:mt-auto transition-all 
                  ${selectedComp && !isLoading
                    ? 'shadow-[0px_4px_10px_rgba(0,0,0,0.25)] hover:opacity-90' 
                    : 'opacity-50 cursor-not-allowed shadow-none'}`}
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {isLoading ? "Submitting..." : "Submit Registration"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-[#3C3C9C] to-[#96A0D2] flex items-center justify-center"><div className="text-[#F1E1B4]">Loading...</div></div>}>
      <RegisterPage />
    </Suspense>
  );
}