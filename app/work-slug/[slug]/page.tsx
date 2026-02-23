"use client";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSoundcloud, FaYoutube } from "react-icons/fa6";
import { musicWorks, designWorks } from "@/lib/works";

export default function WorkDetail() {
  const params = useParams();
  const slug = params.slug;

  const allWorks = [...musicWorks, ...designWorks];
  const work = allWorks.find((w) => w.slug === slug);
  const isMusic = musicWorks.some((w) => w.slug === slug);

  if (!work) return <div className="p-20 font-['Bahnschrift']">WORK NOT FOUND.</div>;

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#333333] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <a href="/#works" className="inline-flex items-center gap-2 font-['Bahnschrift'] opacity-50 hover:opacity-100 transition-opacity mb-12 tracking-widest text-[10pt] uppercase">
          <FaArrowLeft /> BACK TO GALLERY
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="shadow-2xl rounded-lg overflow-hidden bg-white">
            <img src={`/images/${isMusic ? 'MUSIC' : 'DESIGN'} WORKS/${work.filename}`} alt={work.title} className="w-full h-auto" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-[24pt] md:text-[32pt] font-['Mobo-bold'] mb-4 leading-tight">{work.title}</h1>
            <p className="font-['Bahnschrift'] opacity-40 mb-10 tracking-[0.2em] text-[10pt] uppercase">
              {isMusic ? "MUSIC PRODUCTION" : "GRAPHIC DESIGN"}
            </p>
            
            <div className="space-y-6 font-['Mobo'] leading-relaxed text-[11.5pt] whitespace-pre-wrap text-[#333333]/90">
              {work.description || "No description available."}
            </div>

            {work.tool && (
              <div className="mt-12 pt-8 border-t border-[#333333]/10">
                <p className="font-['Bahnschrift'] text-[9pt] opacity-40 tracking-[0.2em] mb-4 uppercase">Tools</p>
                <p className="font-['Mobo'] text-[10.5pt] text-[#333333]/70">{work.tool}</p>
              </div>
            )}

            {(work.soundcloud || work.youtube) && (
              <div className="mt-12 flex gap-8 text-[28px]">
                {work.soundcloud && <a href={work.soundcloud} target="_blank" className="hover:scale-110 transition-transform"><FaSoundcloud /></a>}
                {work.youtube && <a href={work.youtube} target="_blank" className="hover:scale-110 transition-transform"><FaYoutube /></a>}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}