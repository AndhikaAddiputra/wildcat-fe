"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    window.location.href = "/landing";
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // Supabase SSR secara otomatis menangani PKCE jika menggunakan createBrowserClient
      },
    });

    if (error) console.error(error);
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
        
        <div className="relative shrink-0 w-full max-w-[387px] h-[286px]">
          <Image 
            src="/Banner.svg" 
            alt="Wildcat Banner"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="w-full max-w-[592px] h-[613px] bg-[#0A2D6E] rounded-[20px] p-[40px] shadow-[0_0_40px_10px_rgba(246,145,30,0.5)] flex flex-col items-center relative">
          <h2 
            className="text-[36px] font-semibold text-[#F6911E]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Login
          </h2>

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
                onClick={handleLogin} // Ganti fungsinya
                disabled={isLoading}      
                className={`w-full max-w-[484px] h-[70px] bg-[#F6911E] text-[#0A2D6E] font-bold text-[20px] rounded-[15px] flex items-center justify-center gap-3 transition-opacity shadow-[0px_4px_10px_rgba(0,0,0,0.25)] ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      {/* SVG Google Path */}
                    </svg>
                    Login With Google
                  </>
                )}
              </button>
              
              <p className="text-[#F1E1B4] text-[16px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Don&apos;t have an account? <Link href="/register" className="text-[#F6911E] font-bold hover:underline">Click Here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
