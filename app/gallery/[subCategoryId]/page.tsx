import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { Aperture, ChevronLeft, Clock, MapPin, ChevronRight } from "lucide-react";
import GalleryFooter, { GalleryArchiveDivider } from "@/components/GalleryFooter";
import { notFound } from "next/navigation";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { getGalleryData, type Series } from '@/lib/gallery';
import { splitConsecutiveBlockquotes } from "@/lib/markdown";

export const dynamic = 'force-dynamic';

function formatDate(date: string): string {
  if (date === 'Unknown') return '日期不明';
  const d = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
  return d.includes('-') ? date : d;
}

export default async function SubCategoryPage({
  params,
}: {
  params: Promise<{ subCategoryId: string }>;
}) {
  const { subCategoryId } = await params;
  const data = await getGalleryData();

  const subCategory = data.subCategories[subCategoryId];
  if (!subCategory) {
    notFound();
  }

  const parentCategory = data.categories[subCategory.categoryId];
  const isTextCategory = parentCategory?.type === 'text';

  let subCategoryDescription = subCategory.coverDescription;
  if (parentCategory?.folderName && subCategory.folderName) {
    const descriptionPath = path.join(
      process.cwd(),
      'public',
      'gallery',
      parentCategory.folderName,
      subCategory.folderName,
      'description.md',
    );

    try {
      const descriptionFromFile = await fs.readFile(descriptionPath, 'utf8');
      if (descriptionFromFile.trim()) {
        subCategoryDescription = descriptionFromFile;
      }
    } catch {
      // Fallback to JSON description when description.md is missing.
    }
  }

  const seriesList = data.series.filter((s: Series) => s.globalSubCatId === subCategoryId || s.subCategoryId === subCategoryId);

  const getStaggerClass = (index: number) => {
    const pos = index % 3;
    if (pos === 0) return '';
    if (pos === 1) return 'mt-12 md:mt-24';
    if (pos === 2) return index < 3 ? '' : 'md:-mt-12 lg:-mt-24';
    return '';
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
            <Link href="/gallery" className="mr-4 text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div className="w-6 h-6 flex items-center justify-center">
              <Aperture className="w-8 h-8 font-extralight" />
            </div>
            <h1 className="text-white text-3xl font-light leading-tight tracking-[0.2em] uppercase">
              {subCategory.name}
            </h1>
          </div>
        </header>

        <main className="flex-1 flex flex-col py-10 px-6 md:px-20">
          {subCategoryDescription && (
            <div className="mb-16 text-slate-400 font-light tracking-widest leading-relaxed max-w-4xl [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>strong]:text-slate-200 [&>a]:text-blue-400 [&>a]:underline [&>blockquote]:border-l-2 [&>blockquote]:border-white/20 [&>blockquote]:pl-6 [&>blockquote]:text-slate-500 [&>blockquote]:italic [&>blockquote]:my-2">
              <Markdown remarkPlugins={[remarkBreaks]}>{splitConsecutiveBlockquotes(subCategoryDescription)}</Markdown>
            </div>
          )}

          {isTextCategory ? (
            /* Text article list layout */
            <div className="flex flex-col divide-y divide-white/5 max-w-3xl">
              {seriesList.map((item: Series) => (
                <Link
                  href={`/sequence/${item.id}`}
                  key={item.id}
                  className="group py-10 flex flex-col gap-4 hover:bg-white/[0.02] px-4 -mx-4 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] tracking-widest font-mono">{formatDate(item.date)}</span>
                    </div>
                    {item.location !== 'Unknown' && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[10px] tracking-widest">{item.location}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-white text-lg font-light tracking-widest leading-snug group-hover:text-[#C0C0C0] transition-colors">
                    {item.title || item.story.split('\n')[0].replace(/^#+\s*/, '') || `記錄 ${item.seriesId}`}
                  </h3>
                  {item.story && (
                    <p className="text-slate-600 text-sm font-light leading-relaxed line-clamp-3 group-hover:text-slate-500 transition-colors">
                      {item.story.replace(/^#+\s*.+\n?/m, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[(.+?)\]\(.+?\)/g, '$1').trim()}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-4 h-px bg-white/20 group-hover:w-8 transition-all duration-500" />
                    <span className="text-slate-600 text-[10px] tracking-widest uppercase group-hover:text-slate-400 transition-colors flex items-center gap-1">
                      閱讀全文 <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
              {seriesList.length === 0 && (
                <p className="text-slate-700 text-sm tracking-widest py-12">尚無記錄內容。</p>
              )}
            </div>
          ) : (
          /* Image grid layout */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
                {seriesList.map((item: Series, index: number) => (
                  <Link
                    href={`/sequence/${item.id}`}
                    key={item.id}
                    className={`flex flex-col gap-6 group ${getStaggerClass(index)}`}
                  >
                    <div className="relative aspect-[4/5] w-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out cursor-crosshair shadow-[0_0_15px_rgba(255,255,255,0.03)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] border border-white/5">
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col gap-1 px-2">
                      <p className="text-[#C0C0C0]/80 text-xs tracking-[0.3em] uppercase font-light">
                        Series {item.seriesId}
                      </p>
                      <h3 className="text-white text-lg font-light tracking-widest">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
          )}

          <GalleryArchiveDivider />
        </main>

        <GalleryFooter />
      </div>
    </div>
  );
}
