"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa6";
import { musicWorks, designWorks } from "@/lib/works";

export default function WorksList() {
  const params = useParams();
  const type = params.type as string;
  
  const works = type === 'music' ? musicWorks : designWorks;
  const title = type === 'music' ? 'MUSIC WORKS' : 'DESIGN WORKS';

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#333333] pt-20 pb-32 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 md:mb-24 text-left">
          <a href="/#works" className="inline-flex items-center gap-2 font-['Bahnschrift'] text-[10pt] opacity-50 hover:opacity-100 transition-opacity mb-8 tracking-widest uppercase">
            <FaArrowLeft /> BACK TO TOP
          </a>
          {/* 🟢 tracking-widest から tracking-wider に変更 */}
          <h1 className="text-[24pt] md:text-[32pt] font-['Bahnschrift'] tracking-wider uppercase">
            {title}
          </h1>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-6">
          {works.map((work, index) => (
            <motion.a
              key={work.id}
              href={`/work-slug/${work.slug}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img src={encodeURI(`/images/${type.toUpperCase()} WORKS/${work.filename}`)} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <p className="font-['Mobo'] text-[10pt] text-center leading-relaxed tracking-wider">{work.title}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}