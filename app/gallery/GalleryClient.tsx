"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Aperture, Search, User, Moon, Sparkles, FileText } from "lucide-react";
import { type GalleryData, type Category, type SubCategory, type Series } from "@/lib/gallery";
import GalleryFooter, { GalleryArchiveDivider } from "@/components/GalleryFooter";

type SubCategoryWithCover = SubCategory & { coverImage: string };

function truncateAtSecondHeading(text: string): string {
  const lines = text.split('\n');
  let headingCount = 0;
  let start = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i])) {
      headingCount++;
      if (headingCount === 1) { start = i + 1; continue; }
      if (headingCount === 2) return lines.slice(start, i).join('\n').trim();
    }
  }
  return lines.slice(start).join('\n').trim();
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^[-*>]\s+/gm, '')
    .trim();
}

export default function GalleryClient({ data }: { data: GalleryData }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories: Category[] = Object.entries(data.categories)
    .map(([id, cat]) => ({ ...cat, id }))
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));

  const allSubCategories: SubCategoryWithCover[] = Object.entries(data.subCategories).map(([id, subCat]) => {
    const firstSeries = data.series.find((s: Series) => s.globalSubCatId === id || s.subCategoryId === id);
    return {
      ...subCat,
      id,
      coverImage: firstSeries?.coverImage || "https://picsum.photos/seed/fallback/800/1000"
    };
  });

  const filteredSubCategories = activeCategory
    ? allSubCategories.filter((sc) => sc.categoryId === activeCategory)
    : allSubCategories;

  const isTextCat = (categoryId: string) => data.categories[categoryId]?.type === 'text';

  const textSubCategories = filteredSubCategories.filter(sc => isTextCat(sc.categoryId));
  const imageSubCategories = filteredSubCategories.filter(sc => !isTextCat(sc.categoryId));

  const getStaggerClass = (index: number) => {
    const pos = index % 3;
    if (pos === 0) return "";
    if (pos === 1) return "mt-12 md:mt-24";
    if (pos === 2) return index < 3 ? "" : "md:-mt-12 lg:-mt-24";
    return "";
  };

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
            <div
              className="flex h-8 shrink-0 items-center justify-center cursor-pointer group"
              onClick={() => setActiveCategory(null)}
            >
              <p className={`text-sm font-light tracking-widest transition-colors flex items-center ${activeCategory === null ? 'text-white border-b border-white pb-1' : 'text-slate-500 hover:text-[#C0C0C0]'}`}>
                <Sparkles className="w-4 h-4 mr-1 text-[#C0C0C0]" /> 全部 / ALL
              </p>
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex h-8 shrink-0 items-center justify-center cursor-pointer group"
                onClick={() => setActiveCategory(cat.id)}
              >
                <p className={`text-sm font-light tracking-widest transition-colors ${activeCategory === cat.id ? 'text-white border-b border-white pb-1' : 'text-slate-500 hover:text-[#C0C0C0]'}`}>
                  {cat.name} / {cat.nameEn}
                </p>
              </div>
            ))}
          </div>

          {/* Text Category Section */}
          {textSubCategories.length > 0 && (
            <div className="mb-20">
              {(!activeCategory || isTextCat(activeCategory)) && imageSubCategories.length > 0 && (
                <div className="flex items-center gap-4 mb-10">
                  <FileText className="w-4 h-4 text-slate-600" />
                  <p className="text-slate-600 text-[10px] tracking-[0.5em] uppercase font-light">
                    {data.categories[textSubCategories[0].categoryId]?.nameEn || 'EVENTS'}
                  </p>
                  <div className="flex-1 border-t border-white/5" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {textSubCategories.map((item: SubCategoryWithCover) => (
                  <Link
                    href={`/gallery/${item.id}`}
                    key={item.id}
                    className="group border border-white/8 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] p-8 transition-all duration-500 flex flex-col gap-4"
                  >
                    <p className="text-[#C0C0C0]/60 text-[10px] tracking-[0.4em] uppercase font-light">
                      {categories.find(c => c.id === item.categoryId)?.nameEn || 'EVENTS'}
                    </p>
                    <h3 className="text-white text-lg font-light tracking-widest leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-slate-600 text-xs font-light leading-relaxed line-clamp-3 mt-auto">
                      {stripMarkdown(truncateAtSecondHeading(item.coverDescription))}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-4 h-px bg-white/20 group-hover:w-8 transition-all duration-500" />
                      <span className="text-slate-600 text-[10px] tracking-widest uppercase group-hover:text-slate-400 transition-colors">
                        閱覽記錄
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Image Category Section */}
          {imageSubCategories.length > 0 && (
            <div>
              {(!activeCategory || !isTextCat(activeCategory)) && textSubCategories.length > 0 && (
                <div className="flex items-center gap-4 mb-10">
                  <p className="text-slate-600 text-[10px] tracking-[0.5em] uppercase font-light">
                    影像紀錄 / PHOTOS
                  </p>
                  <div className="flex-1 border-t border-white/5" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
                {imageSubCategories.map((item: SubCategoryWithCover, index: number) => (
                  <Link
                    href={`/gallery/${item.id}`}
                    key={item.id}
                    className={`flex flex-col gap-6 group ${getStaggerClass(index)}`}
                  >
                    <div className="relative aspect-[4/5] w-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out cursor-crosshair shadow-[0_0_15px_rgba(255,255,255,0.03)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] border border-white/5">
                      <Image
                        src={item.coverImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                        loading={index < 12 ? "eager" : "lazy"}
                      />
                    </div>
                    <div className="flex flex-col gap-1 px-2">
                      <p className="text-[#C0C0C0]/80 text-xs tracking-[0.3em] uppercase font-light">
                        {categories.find(c => c.id === item.categoryId)?.name || 'CATEGORY'}
                      </p>
                      <h3 className="text-white text-lg font-light tracking-widest">
                        {item.name}
                      </h3>
                      <p className="text-slate-600 text-xs italic whitespace-pre-line">
                        {truncateAtSecondHeading(item.coverDescription)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <GalleryArchiveDivider />
        </main>

        <GalleryFooter />
      </div>
    </div>
  );
}
