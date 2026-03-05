"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const LoginPage = () => {
  const handleBack = () => {
    window.location.href = "/landing";
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

      {/* Main Container */}
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

        {/* Google Login */}
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
                onClick={() => alert("Mengarahkan ke Google Login...")}
                className="w-full max-w-[484px] h-[70px] bg-[#F6911E] text-[#0A2D6E] font-bold text-[20px] rounded-[15px] flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-[0px_4px_10px_rgba(0,0,0,0.25)]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#0A2D6E"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#0A2D6E"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#0A2D6E"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#0A2D6E"/></svg>
                Login With Google
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