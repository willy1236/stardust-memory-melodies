import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { promises as fs } from 'fs';
import path from 'path';
import {
  Aperture,
  Share2,
  Info,
  ChevronLeft,
  Play,
  ChevronRight,
  Clock,
  MapPin,
  Fingerprint,
} from "lucide-react";

async function getGalleryData() {
  const filePath = path.join(process.cwd(), 'public', 'gallery', 'data.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function SequencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getGalleryData();
  const sequence = data.series.find((s: any) => s.id === id);

  if (!sequence) {
    notFound();
  }

  const thumbnails = sequence.images;
  const mainImage = thumbnails[0] || sequence.coverImage;

  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black text-slate-100"
      style={{
        backgroundImage: `
          radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0),
          radial-gradient(circle at 10% 10%, rgba(56, 189, 248, 0.03) 0%, transparent 40%),
          radial-gradient(circle at 90% 90%, rgba(139, 92, 246, 0.03) 0%, transparent 40%)
        `,
        backgroundSize: "100px 100px, 100% 100%, 100% 100%",
      }}
    >
      {/* Header / Nav */}
      <header className="flex items-center justify-between px-6 py-8 md:px-12 bg-transparent">
        <Link href="/gallery" className="flex items-center gap-3">
          <Aperture className="text-[#e2e8f0] w-6 h-6" />
          <h2 className="text-[#e2e8f0] text-sm font-medium tracking-[0.3em] uppercase">
            記憶序列 / Project Memories
          </h2>
        </Link>
        <div className="flex gap-6">
          <button className="flex items-center justify-center text-slate-400 hover:text-[#e2e8f0] transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center text-slate-400 hover:text-[#e2e8f0] transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-7xl mx-auto w-full">
        {/* Hero Image Section */}
        <div className="w-full max-w-4xl">
          <div className="relative group">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-zinc-800 shadow-2xl">
              <Image
                src={mainImage}
                alt={sequence.title}
                fill
                className="object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Minimal Controls */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-zinc-700 hover:border-[#e2e8f0] transition-colors">
                <ChevronLeft className="w-6 h-6 text-[#e2e8f0]" />
              </button>
              <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-zinc-700 hover:border-[#e2e8f0] transition-colors">
                <Play className="w-6 h-6 text-[#e2e8f0]" />
              </button>
              <button className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-zinc-700 hover:border-[#e2e8f0] transition-colors">
                <ChevronRight className="w-6 h-6 text-[#e2e8f0]" />
              </button>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-16 mb-20 max-w-2xl w-full text-center">
          <h3 className="text-[#e2e8f0] tracking-[0.5em] text-xl font-light leading-loose uppercase mb-8">
            {sequence.title}
          </h3>
          <p className="text-slate-400 text-base font-light leading-[2.2] tracking-widest px-4 opacity-70 whitespace-pre-line">
            {sequence.story}
          </p>
        </div>

        {/* Metadata List */}
        <div className="w-full max-w-md flex flex-col gap-4 mb-24">
          <div className="flex items-center justify-between border-b pb-3 celestial-line border-opacity-30 border-zinc-500/20">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-slate-500 text-[11px] tracking-widest uppercase">
                發生時間
              </span>
            </div>
            <span className="text-[#e2e8f0] text-xs tracking-widest">
              {sequence.date}
            </span>
          </div>
          <div className="flex items-center justify-between border-b pb-3 celestial-line border-opacity-30 border-zinc-500/20">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-slate-500 text-[11px] tracking-widest uppercase">
                標定地點
              </span>
            </div>
            <span className="text-[#e2e8f0] text-xs tracking-widest">
              {sequence.location}
            </span>
          </div>
          <div className="flex items-center justify-between border-b pb-3 celestial-line border-opacity-30 border-zinc-500/20">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-4 h-4 text-slate-500" />
              <span className="text-slate-500 text-[11px] tracking-widest uppercase">
                序列編號
              </span>
            </div>
            <span className="text-[#e2e8f0] text-xs tracking-widest font-mono">
              SEQ-MS-{sequence.seriesId}
            </span>
          </div>
        </div>
      </main>

      {/* Thumbnails Gallery */}
      <footer className="w-full px-6 py-12 md:px-12 border-t border-zinc-900/50 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px] tracking-[0.4em] uppercase">
              關聯片段 / Associated Segments
            </span>
            <span className="text-slate-500 text-[10px] tracking-widest">
              01 / {thumbnails.length < 10 ? `0${thumbnails.length}` : thumbnails.length}
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            {thumbnails.map((src: string, index: number) => (
              <div
                key={index}
                className={`flex-none w-24 aspect-square border p-1 transition-all cursor-pointer ${
                  index === 0
                    ? "border-[#e2e8f0]"
                    : "border-zinc-800 opacity-50 hover:opacity-100 hover:border-zinc-600"
                }`}
              >
                <div className="relative w-full h-full bg-zinc-800 grayscale hover:grayscale-0 transition-all">
                  <Image
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
