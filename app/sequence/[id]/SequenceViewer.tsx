"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, Play, Pause, ChevronRight, Clock, MapPin, Fingerprint } from "lucide-react";
import Markdown from "react-markdown";

export default function SequenceViewer({ sequence, prevId, nextId }: { sequence: any; prevId: string | null; nextId: string | null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const images = sequence.images && sequence.images.length > 0 ? sequence.images : [sequence.coverImage];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-7xl mx-auto w-full">
      {/* Hero Image Section */}
      <div className="w-full max-w-6xl flex items-center gap-4">
        <div className="flex-none w-10 flex justify-center">
          {prevId ? (
            <Link href={`/sequence/${prevId}`} className="p-2 text-slate-600 hover:text-white transition-colors">
              <ChevronLeft className="w-8 h-8" />
            </Link>
          ) : (
            <div className="w-12" />
          )}
        </div>

        <div className="flex-1">
          <div className="relative group">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-zinc-800 shadow-2xl">
              <Image
                src={images[currentIndex]}
                alt={`${sequence.title} - ${currentIndex + 1}`}
                fill
                className="object-cover opacity-80 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button onClick={prevImage} className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-zinc-700 hover:border-[#e2e8f0] transition-colors">
                <ChevronLeft className="w-6 h-6 text-[#e2e8f0]" />
              </button>
              <button onClick={togglePlay} className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-zinc-700 hover:border-[#e2e8f0] transition-colors">
                {isPlaying ? <Pause className="w-6 h-6 text-[#e2e8f0]" /> : <Play className="w-6 h-6 text-[#e2e8f0]" />}
              </button>
              <button onClick={nextImage} className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-zinc-700 hover:border-[#e2e8f0] transition-colors">
                <ChevronRight className="w-6 h-6 text-[#e2e8f0]" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-none w-10 flex justify-center">
          {nextId ? (
            <Link href={`/sequence/${nextId}`} className="p-2 text-slate-600 hover:text-white transition-colors">
              <ChevronRight className="w-8 h-8" />
            </Link>
          ) : (
            <div className="w-12" />
          )}
        </div>
      </div>

      {/* Text Content */}
      <div className="mt-16 mb-20 max-w-2xl w-full text-center">
        <h3 className="text-[#e2e8f0] tracking-[0.5em] text-xl font-light leading-loose uppercase mb-8">
          {sequence.title}
        </h3>
        {sequence.story && (
          <div className="text-slate-400 text-base font-light leading-[2.2] tracking-widest px-4 opacity-70 whitespace-pre-line text-center [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>strong]:text-slate-200 [&>a]:text-blue-400 [&>a]:underline">
            <Markdown>{sequence.story}</Markdown>
          </div>
        )}
      </div>

      {/* Metadata List */}
      <div className="w-full max-w-md flex flex-col gap-4 mb-24">
        <div className="flex items-center justify-between border-b pb-3 celestial-line border-opacity-30 border-zinc-500/20">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-500 text-[11px] tracking-widest uppercase">發生時間</span>
          </div>
          <span className="text-[#e2e8f0] text-xs tracking-widest">{sequence.date}</span>
        </div>
        <div className="flex items-center justify-between border-b pb-3 celestial-line border-opacity-30 border-zinc-500/20">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="text-slate-500 text-[11px] tracking-widest uppercase">標定地點</span>
          </div>
          <span className="text-[#e2e8f0] text-xs tracking-widest">{sequence.location}</span>
        </div>
        <div className="flex items-center justify-between border-b pb-3 celestial-line border-opacity-30 border-zinc-500/20">
          <div className="flex items-center gap-3">
            <Fingerprint className="w-4 h-4 text-slate-500" />
            <span className="text-slate-500 text-[11px] tracking-widest uppercase">序列編號</span>
          </div>
          <span className="text-[#e2e8f0] text-xs tracking-widest font-mono">SEQ-MS-{sequence.seriesId}</span>
        </div>
      </div>

      {/* Thumbnails Gallery */}
      <div className="w-full border-t border-zinc-900/50 pt-12 pb-12">
        <div className="flex items-center justify-between mb-6">
          <span className="text-slate-500 text-[10px] tracking-[0.4em] uppercase">
            關聯片段 / Associated Segments
          </span>
          <span className="text-slate-500 text-[10px] tracking-widest">
            {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} / {images.length < 10 ? `0${images.length}` : images.length}
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {images.map((src: string, index: number) => (
            <div
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsPlaying(false);
              }}
              className={`flex-none w-24 aspect-square border p-1 transition-all cursor-pointer ${
                index === currentIndex
                  ? "border-[#e2e8f0]"
                  : "border-zinc-800 opacity-50 hover:opacity-100 hover:border-zinc-600"
              }`}
            >
              <div className={`relative w-full h-full bg-zinc-800 transition-all ${index === currentIndex ? 'grayscale-0' : 'grayscale hover:grayscale-0'}`}>
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
    </main>
  );
}
