import Link from "next/link";
import { Sparkles } from "lucide-react";

export function GalleryArchiveDivider() {
  return (
    <div className="mt-32 border-t border-white/5 pt-12 flex flex-col items-center">
      <p className="text-slate-700 text-[10px] tracking-[0.5em] uppercase font-light mb-4">
        Project Memories • Archive
      </p>
      <div className="w-1 h-1 bg-white/20 rounded-full flex items-center justify-center">
        <Sparkles className="w-3 h-3 text-white/30" />
      </div>
    </div>
  );
}

export default function GalleryFooter() {
  return (
    <footer className="px-6 py-12 md:px-20 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
      <nav className="flex gap-10">
        <Link href="/" className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C0C0C0]">首頁</Link>
        <Link href="/gallery" className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C0C0C0]">畫廊</Link>
        <Link href="#" className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C0C0C0]">設定</Link>
      </nav>
      <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500">
        © 2026 記憶畫廊
      </div>
    </footer>
  );
}
