import React from "react";
import DotGrid from "@/components/DotGrid";
import { Github } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center fixed z-1 bg-black">
      <DotGrid
        dotSize={5}
        gap={15}
        baseColor="#271E37"
        activeColor="#5227FF"
        proximity={120}
        speedTrigger={100}
        shockRadius={150}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
      />
      <nav
        className="text-white h-10 lg:w-200 md:w-160 w-84 py-7 md:px-6 px-3 rounded-4xl flex items-center justify-between
   absolute z-2 md:top-5 top-3 bg-white/15 backdrop-filter backdrop-blur-lg bg-opacity-40 border border-zinc-500 "
      >
        <div className="flex gap-1 select-none">
          <h3 className="text-xl font-semibold ">Droply</h3>
          <img className="w-8 object-cover" src="/cloud.png" alt="logo" />
        </div>
        <div className="flex items-center text-white/80 md:gap-4 gap-3">
          <Link
            to="/register"
            className="hover:text-white transition cursor-pointer"
          >
            SignUp
          </Link>
          <Link
            to="login"
            className="hover:text-white transition cursor-pointer"
          >
            Login
          </Link>
        </div>
      </nav>

      <div className="absolute md:top-56 top-52 z-5">
        <h3 className=" select-none text-white text-center md:text-5xl text-[1.5rem] md:w-[70%] m-auto px-5  font-semibold ">
          Upload, manage, and access your files securely with <span className="text-blue-400">Droply</span>.
        </h3>
        <div className="flex items-center justify-center md:gap-5 text-black text-xl text-center mt-10">
          <Link
            to="/register"
            className="scale-90 hover:scale-100 transition-all duration-300 flex items-center bg-white/90 hover:bg-white py-3 px-7 rounded-md cursor-pointer"
          >
            Get Started <ChevronRight />
          </Link>
          <Link
            to="https://github.com/Adityamkumar/File_Uploading_App"
            className="scale-90 hover:scale-100 transition-all duration-300 flex items-center gap-2 bg-white/90 hover:bg-white py-3 px-7 rounded-md cursor-pointer"
          >
            GitHub <Github />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
