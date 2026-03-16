import Image from "next/image";
import Link from "next/link";
import { Aperture, ChevronLeft, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { getGalleryData } from '@/lib/gallery';

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

  const seriesList = data.series.filter((s: any) => s.globalSubCatId === subCategoryId || s.subCategoryId === subCategoryId);

  const getStaggerClass = (index: number) => {
    const pos = index % 3;
    if (pos === 0) return '';
    if (pos === 1) return 'mt-12 md:mt-24';
    if (pos === 2) return 'md:-mt-12 lg:-mt-24';
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
          {subCategory.description && (
            <div className="mb-16 text-slate-400 font-light tracking-widest leading-relaxed max-w-4xl [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>strong]:text-slate-200 [&>a]:text-blue-400 [&>a]:underline">
              <Markdown>{subCategory.description}</Markdown>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
            {seriesList.map((item: any, index: number) => (
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
            <Link href="/" className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C0C0C0]">首頁</Link>
            <Link href="/gallery" className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C0C0C0]">畫廊</Link>
            <Link href="#" className="text-[10px] tracking-[0.2em] uppercase text-white hover:text-[#C0C0C0]">設定</Link>
          </nav>
          <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500">
            © 2025 記憶畫廊
          </div>
        </footer>
      </div>
    </div>
  );
}
