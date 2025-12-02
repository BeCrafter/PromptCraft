import { Spotlight } from "@/components/ui/Spotlight";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Unlock AI Potential <br /> with Perfect Prompts.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Discover a curated collection of prompts for coding, writing, and image generation. 
          Crafted for perfection, ready for production.
        </p>
        <div className="mt-8 flex justify-center">
           <Link href="/prompts" className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
              Explore Library
           </Link>
        </div>
      </div>
    </div>
  );
}
