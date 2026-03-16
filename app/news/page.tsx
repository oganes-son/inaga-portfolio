"use client";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa6";
import { newsData } from "@/lib/works";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-[#333333] pt-20 pb-32 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 md:mb-24 text-left">
          <a href="/#news" className="inline-flex items-center gap-2 font-['Bahnschrift'] text-[10pt] opacity-50 hover:opacity-100 transition-opacity mb-8 tracking-widest">
            <FaArrowLeft /> BACK TO TOP
          </a>
          <h1 className="text-[24pt] md:text-[32pt] font-['Bahnschrift'] tracking-wider">NEWS</h1>
        </header>

        <div className="space-y-0">
          {newsData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col md:flex-row md:gap-8 border-b border-[#333333]/10 py-6 font-['Mobo']"
            >
              <span className="font-['Bahnschrift'] opacity-70 w-32 tracking-widest text-[9.5pt] md:text-[10pt] shrink-0">
                {item.date}
              </span>
              <div className="flex flex-col gap-2">
                <span className="text-[9.5pt] md:text-[12.2pt] leading-[2.1] tracking-[0.12em]">
                  {item.content}
                </span>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9pt] font-['Bahnschrift'] tracking-widest opacity-50 hover:opacity-100 underline underline-offset-4 transition-opacity w-fit uppercase"
                  >
                    Visit Link →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
