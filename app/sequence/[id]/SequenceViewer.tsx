"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, Play, Pause, ChevronRight, Clock, MapPin, Fingerprint } from "lucide-react";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { type Series } from "@/lib/gallery";
import { splitConsecutiveBlockquotes } from "@/lib/markdown";

function formatDate(date: string): string {
  if (date === 'Unknown') return '日期不明';
  return date.replace(/(\d{4})(\d{2})(\d{2})/, '$1 / $2 / $3');
}

function TextArticleViewer({ sequence, prevId, nextId, sequenceIndex, sequenceTotal }: { sequence: Series; prevId: string | null; nextId: string | null; sequenceIndex: number; sequenceTotal: number }) {
  const mdFirstLine = sequence.mdContent?.split('\n')[0].replace(/^#+\s*/, '').trim();
  const storyFirstLine = sequence.story?.split('\n')[0].replace(/^#+\s*/, '').trim();
  const title = sequence.title || mdFirstLine || storyFirstLine || `記錄 ${sequence.seriesId}`;

  // Strip first line from mdContent only if it was extracted as the title
  const mdBody = !sequence.title && mdFirstLine && sequence.mdContent?.split('\n')[0].match(/^#/)
    ? sequence.mdContent.replace(/^.+\n?/, '').trim()
    : sequence.mdContent;

  const storyBody = sequence.story;

  const markdownClass = "text-slate-300 text-base font-light leading-[2] tracking-wide\
          [&>p]:mb-6\
          [&>h1]:text-2xl [&>h1]:text-white [&>h1]:font-light [&>h1]:tracking-widest [&>h1]:mb-6 [&>h1]:mt-10\
          [&>h2]:text-xl [&>h2]:text-white [&>h2]:font-light [&>h2]:tracking-widest [&>h2]:mb-4 [&>h2]:mt-8\
          [&>h3]:text-lg [&>h3]:text-slate-200 [&>h3]:font-light [&>h3]:tracking-widest [&>h3]:mb-4 [&>h3]:mt-6\
          [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6 [&>ul>li]:mb-2\
          [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6 [&>ol>li]:mb-2\
          [&>strong]:text-white [&>strong]:font-medium\
          [&>blockquote]:border-l-2 [&>blockquote]:border-white/20 [&>blockquote]:pl-6 [&>blockquote]:text-slate-500 [&>blockquote]:italic [&>blockquote]:my-2\
          [&>a]:text-blue-400 [&>a]:underline [&>a]:underline-offset-2";

  return (
    <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12">
      {/* Navigation row */}
      <div className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-4">
          {prevId ? (
            <Link href={`/sequence/${prevId}`} className="text-slate-600 hover:text-white transition-colors flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[10px] tracking-widest uppercase">上一篇</span>
            </Link>
          ) : <div />}
        </div>
        <span className="text-slate-600 text-[11px] tracking-[0.4em] uppercase font-mono">
          {String(sequenceIndex).padStart(2, '0')} / {String(sequenceTotal).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-4">
          {nextId ? (
            <Link href={`/sequence/${nextId}`} className="text-slate-600 hover:text-white transition-colors flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase">下一篇</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-8 mb-12">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-3 h-3" />
          <span className="text-[10px] tracking-widest font-mono">{formatDate(sequence.date)}</span>
        </div>
        {sequence.location !== 'Unknown' && (
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] tracking-widest">{sequence.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-slate-700 ml-auto">
          <Fingerprint className="w-3 h-3" />
          <span className="text-[10px] tracking-widest font-mono">SEQ-MS-{sequence.seriesId}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-12 h-px bg-white/20 mb-12" />

      {/* Title */}
      <h1 className="text-white text-2xl font-light tracking-[0.15em] leading-loose mb-12">
        {title}
      </h1>

      {/* Story body */}
      {storyBody && (
        <div className={markdownClass}>
          <Markdown remarkPlugins={[remarkBreaks]}>{splitConsecutiveBlockquotes(storyBody)}</Markdown>
        </div>
      )}

      {/* Filesystem .md content */}
      {mdBody && (
        <div className={markdownClass}>
          <Markdown remarkPlugins={[remarkBreaks]}>{splitConsecutiveBlockquotes(mdBody)}</Markdown>
        </div>
      )}

      {/* Bottom spacer */}
      <div className="mt-24 border-t border-white/5 pt-12 flex items-center justify-between">
        {prevId ? (
          <Link href={`/sequence/${prevId}`} className="text-slate-600 hover:text-white transition-colors flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-[10px] tracking-widest uppercase">上一篇</span>
          </Link>
        ) : <div />}
        {nextId ? (
          <Link href={`/sequence/${nextId}`} className="text-slate-600 hover:text-white transition-colors flex items-center gap-2">
            <span className="text-[10px] tracking-widest uppercase">下一篇</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : <div />}
      </div>
    </main>
  );
}

function ImageSequenceViewer({ sequence, prevId, nextId, sequenceIndex, sequenceTotal }: { sequence: Series; prevId: string | null; nextId: string | null; sequenceIndex: number; sequenceTotal: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const images = sequence.images;

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
          <div className="flex justify-end mb-3">
            <span className="text-slate-500 text-[11px] tracking-[0.4em] uppercase font-mono">
              {String(sequenceIndex).padStart(2, '0')} / {String(sequenceTotal).padStart(2, '0')}
            </span>
          </div>
          <div className="relative group">
            <div className="relative w-full h-[70vh] overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-zinc-800 shadow-2xl">
              <Image
                src={images[currentIndex]}
                alt={`${sequence.title} - ${currentIndex + 1}`}
                fill
                className="object-contain opacity-80 transition-opacity duration-500"
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
          <div className="text-slate-400 text-base font-light leading-[2.2] tracking-widest px-4 opacity-70 whitespace-pre-line text-center [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>strong]:text-slate-200 [&>a]:text-blue-400 [&>a]:underline [&>blockquote]:border-l-2 [&>blockquote]:border-white/20 [&>blockquote]:pl-6 [&>blockquote]:text-slate-500 [&>blockquote]:italic [&>blockquote]:my-2">
            <Markdown remarkPlugins={[remarkBreaks]}>{splitConsecutiveBlockquotes(sequence.story)}</Markdown>
          </div>
        )}
        {sequence.mdContent && (
          <div className="text-slate-400 text-base font-light leading-[2.2] tracking-widest px-4 opacity-70 whitespace-pre-line text-center [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>strong]:text-slate-200 [&>a]:text-blue-400 [&>a]:underline [&>blockquote]:border-l-2 [&>blockquote]:border-white/20 [&>blockquote]:pl-6 [&>blockquote]:text-slate-500 [&>blockquote]:italic [&>blockquote]:my-2">
            <Markdown remarkPlugins={[remarkBreaks]}>{splitConsecutiveBlockquotes(sequence.mdContent)}</Markdown>
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

export default function SequenceViewer({ sequence, prevId, nextId, sequenceIndex, sequenceTotal }: { sequence: Series; prevId: string | null; nextId: string | null; sequenceIndex: number; sequenceTotal: number }) {
  if (!sequence.images || sequence.images.length === 0) {
    return <TextArticleViewer sequence={sequence} prevId={prevId} nextId={nextId} sequenceIndex={sequenceIndex} sequenceTotal={sequenceTotal} />;
  }
  return <ImageSequenceViewer sequence={sequence} prevId={prevId} nextId={nextId} sequenceIndex={sequenceIndex} sequenceTotal={sequenceTotal} />;
}
