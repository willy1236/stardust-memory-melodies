import Link from "next/link";
import { notFound } from "next/navigation";
import { Aperture, Share2, Info } from "lucide-react";
import SequenceViewer from "./SequenceViewer";
import { getGalleryData, type Series } from '@/lib/gallery';

export const dynamic = 'force-dynamic';

export default async function SequencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getGalleryData();
  const seriesList = data.series;
  const sequence = seriesList.find((s: Series) => s.id === id);

  if (!sequence) {
    notFound();
  }

  const subCatId = sequence.globalSubCatId || sequence.subCategoryId;
  const siblingList = seriesList.filter((s: Series) => (s.globalSubCatId || s.subCategoryId) === subCatId);
  const siblingIndex = siblingList.findIndex((s: Series) => s.id === id);

  const prevId = siblingIndex > 0 ? siblingList[siblingIndex - 1].id : null;
  const nextId = siblingIndex < siblingList.length - 1 ? siblingList[siblingIndex + 1].id : null;

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
        <Link href={`/gallery/${sequence.globalSubCatId || sequence.subCategoryId}`} className="flex items-center gap-3">
          <Aperture className="text-[#e2e8f0] w-6 h-6" />
          <h2 className="text-[#e2e8f0] text-sm font-medium tracking-[0.3em] uppercase">
            返回系列 / Back to Series
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

      {/* Main Content with Carousel */}
      <SequenceViewer sequence={sequence} prevId={prevId} nextId={nextId} sequenceIndex={siblingIndex + 1} sequenceTotal={siblingList.length} />
    </div>
  );
}
