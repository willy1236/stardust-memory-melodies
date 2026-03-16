import Image from "next/image";
import Link from "next/link";
import { Aperture, Search, User, Moon, Star, Sparkles } from "lucide-react";

const galleryItems = [
  {
    id: "1-1-101",
    series: "Series 01",
    title: "冬日碎片",
    subtitle: "Winter Fragments, 2025",
    image: "https://picsum.photos/seed/winter/800/1000",
    className: "",
  },
  {
    id: "1-2-102",
    series: "Series 02",
    title: "寂靜之聲",
    subtitle: "Sound of Silence, 2024",
    image: "https://picsum.photos/seed/silence/800/1000",
    className: "mt-12 md:mt-24",
  },
  {
    id: "1-3-103",
    series: "Series 03",
    title: "光影流轉",
    subtitle: "Flowing Shadows, 2024",
    image: "https://picsum.photos/seed/shadows/800/1000",
    className: "",
  },
  {
    id: "1-4-104",
    series: "Series 04",
    title: "塵封往事",
    subtitle: "Dusty Memories, 2024",
    image: "https://picsum.photos/seed/dusty/800/1000",
    className: "md:-mt-12 lg:-mt-24",
  },
  {
    id: "1-5-105",
    series: "Series 05",
    title: "破曉時刻",
    subtitle: "Dawn Breaking, 2025",
    image: "https://picsum.photos/seed/dawn/800/1000",
    className: "",
  },
  {
    id: "1-6-106",
    series: "Series 06",
    title: "無盡夏日",
    subtitle: "Endless Summer, 2024",
    image: "https://picsum.photos/seed/summer/800/1000",
    className: "mt-12 md:mt-0",
  },
];

export default function Gallery() {
  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-black"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        backgroundSize: "100px 100px",
      }}
    >
      <div className="flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/10 px-6 py-8 md:px-20">
          <div className="flex items-center gap-4 text-white">
            <div className="w-6 h-6 flex items-center justify-center">
              <Aperture className="w-8 h-8 font-extralight" />
            </div>
            <h1 className="text-white text-3xl font-light leading-tight tracking-[0.2em] uppercase">
              記憶畫廊
            </h1>
          </div>
          <div className="hidden lg:block opacity-20 ml-4">
            <Moon className="w-4 h-4" />
          </div>
          <div className="flex gap-6">
            <button className="flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Search className="w-6 h-6 font-light" />
            </button>
            <button className="flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <User className="w-6 h-6 font-light" />
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col py-10 px-6 md:px-20">
          <div className="flex gap-8 mb-16 overflow-x-auto hide-scrollbar border-b border-white/5 pb-4">
            <div className="flex h-8 shrink-0 items-center justify-center cursor-pointer group">
              <p className="text-white text-sm font-light tracking-widest border-b border-white pb-1 flex items-center">
                <Sparkles className="w-4 h-4 mr-1 text-[#C0C0C0]" /> 全部 / ALL
              </p>
            </div>
            <div className="flex h-8 shrink-0 items-center justify-center cursor-pointer group">
              <p className="text-slate-500 text-sm font-light tracking-widest hover:text-[#C0C0C0] transition-colors">
                2025
              </p>
            </div>
            <div className="flex h-8 shrink-0 items-center justify-center cursor-pointer group">
              <p className="text-slate-500 text-sm font-light tracking-widest hover:text-[#C0C0C0] transition-colors">
                2024
              </p>
            </div>
            <div className="flex h-8 shrink-0 items-center justify-center cursor-pointer group">
              <p className="text-slate-500 text-sm font-light tracking-widest hover:text-[#C0C0C0] transition-colors flex items-center">
                精選 / CURATED <Star className="w-3 h-3 ml-1 opacity-60" />
              </p>
            </div>
            <div className="flex h-8 shrink-0 items-center justify-center cursor-pointer group">
              <p className="text-slate-500 text-sm font-light tracking-widest hover:text-[#C0C0C0] transition-colors">
                碎片 / FRAGMENTS
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
            {galleryItems.map((item) => (
              <Link
                href={`/sequence/${item.id}`}
                key={item.id}
                className={`flex flex-col gap-6 group ${item.className}`}
              >
                <div className="relative aspect-[4/5] w-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out cursor-crosshair shadow-[0_0_15px_rgba(255,255,255,0.03)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] border border-white/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col gap-1 px-2">
                  <p className="text-[#C0C0C0]/80 text-xs tracking-[0.3em] uppercase font-light">
                    {item.series}
                  </p>
                  <h3 className="text-white text-lg font-light tracking-widest">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs italic">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-32 border-t border-white/5 pt-12 flex flex-col items-center">
            <p className="text-slate-700 text-[10px] tracking-[0.5em] uppercase font-light mb-4">
              Project Memories • Archive
            </p>
            <div className="w-1 h-1 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white/30" />
            </div>
          </div>
        </main>

        <footer className="px-6 py-12 md:px-20 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
          <nav className="flex gap-10">
            <Link
              href="/"
              className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C0C0C0]"
            >
              首頁
            </Link>
            <Link
              href="/gallery"
              className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C0C0C0]"
            >
              畫廊
            </Link>
            <Link
              href="#"
              className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C0C0C0]"
            >
              設定
            </Link>
          </nav>
          <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500">
            © 2025 記憶畫廊
          </div>
        </footer>
      </div>
    </div>
  );
}
