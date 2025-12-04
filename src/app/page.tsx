"use client";
import { Spotlight } from "@/components/ui/Spotlight";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Zap, Code, PenTool, ArrowRight } from "lucide-react";

const promptExamples = [
  { icon: Code, text: "JavaScript Expert", color: "from-yellow-500 to-orange-500" },
  { icon: PenTool, text: "Novel Writer", color: "from-purple-500 to-pink-500" },
  { icon: Zap, text: "AI Assistant", color: "from-blue-500 to-cyan-500" },
];

const typingTexts = [
  "Perfect Prompts",
  "AI Excellence",
  "Creative Power",
  "Smart Solutions"
];

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = typingTexts[currentTextIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText.length < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, 100);
    } else if (!isDeleting && displayText.length === currentText.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length - 1));
      }, 50);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black antialiased relative overflow-hidden">
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-purple-950/20" />
      
      {/* Spotlight 效果 */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      {/* 额外的光效 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />

      {/* 主要内容 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 md:py-32">
        {/* 顶部装饰 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-neutral-300">Curated Prompt Collection</span>
          </div>
        </motion.div>

        {/* 主标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-6"
        >
          <h1 className="text-5xl md:text-8xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200">
              Unlock AI Potential
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 inline-block mt-2">
              with {displayText}
              <motion.span 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block"
              >
                |
              </motion.span>
            </span>
          </h1>
        </motion.div>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto text-center mb-12 leading-relaxed"
        >
          Discover a curated collection of <span className="text-blue-400 font-semibold">perfect prompts</span> for coding, writing, and AI generation. 
          <br className="hidden md:block" />
          Crafted for excellence, <span className="text-purple-400 font-semibold">ready for production</span>.
        </motion.p>

        {/* 提示词示例卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
        >
          {promptExamples.map((example, index) => {
            const Icon = example.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 from-blue-500/50 to-purple-500/50 rounded-2xl" />
                <div className="relative p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm group-hover:border-blue-500/50 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${example.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-semibold text-lg">{example.text}</p>
                  <p className="text-neutral-400 text-sm mt-2">Ready to use</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA 按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <Link 
            href="/prompts"
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Prompt Library
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </motion.div>

        {/* 底部装饰文字 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-neutral-500 text-sm">
            <span className="text-blue-400">100+</span> Premium Prompts • 
            <span className="text-purple-400"> Expertly</span> Curated • 
            <span className="text-pink-400"> Production</span> Ready
          </p>
        </motion.div>
      </div>

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
