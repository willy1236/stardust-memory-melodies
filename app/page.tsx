import Image from "next/image";
import Link from "next/link";
import { Sparkles, Menu } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <StarryBackground />
      <div className="flex h-full grow flex-col relative z-10">
        <div className="px-6 lg:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[1200px] flex-1">
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-slate-100" />
                <h2 className="text-slate-100 text-sm font-light tracking-[0.2em] uppercase">
                  Project Memories
                </h2>
              </div>
              <button className="flex items-center justify-center p-2 text-slate-100 hover:text-white transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </header>

            <main className="flex flex-col">
              <div className="pt-24 pb-16 text-center">
                <h1 className="text-slate-100 tracking-widest-extra text-5xl md:text-7xl font-extralight leading-tight px-4">
                  星塵交響曲
                </h1>
                <p className="mt-8 text-slate-400 font-light tracking-[0.3em] text-xs uppercase">
                  Stardust Symphony
                </p>
              </div>

              <div className="mb-12">
                <div className="relative w-full aspect-[21/9] overflow-hidden nebula-mask">
                  <Image
                    src="https://picsum.photos/seed/nebula/1920/820"
                    alt="Deep space violet and blue glowing nebula"
                    fill
                    className="object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="flex justify-center mb-32">
                <div className="flex flex-col sm:flex-row gap-6 px-4 py-3 w-full max-w-md justify-center">
                  <Link
                    href="/gallery"
                    className="flex-1 flex items-center justify-center h-12 border border-white/20 text-white text-xs font-light tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
                  >
                    開始探索
                  </Link>
                  <button className="flex-1 h-12 border border-white/20 text-white text-xs font-light tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
                    瞭解更多
                  </button>
                </div>
              </div>

              <div className="px-4">
                <div className="pt-4 mb-12">
                  <div className="star-map-line mb-8 opacity-40"></div>
                  <h3 className="text-slate-400 text-xs font-light tracking-[0.3em] uppercase">
                    Nebula Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                    <Link
                      href="/gallery?category=origin"
                      className="group cursor-pointer block"
                    >
                      <div className="relative aspect-square w-full grayscale group-hover:grayscale-0 transition-all duration-700">
                        <Image
                          src="https://picsum.photos/seed/galaxy/800/800"
                          alt="Monochrome image of distant spiraling galaxy"
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="mt-6">
                        <h4 className="text-white text-sm font-light tracking-widest">
                          初始星雲
                        </h4>
                        <p className="text-slate-500 text-xs mt-2 font-light">
                          Origin Nebula
                        </p>
                      </div>
                    </Link>
                    <Link
                      href="/gallery?category=orbit"
                      className="group cursor-pointer block"
                    >
                      <div className="relative aspect-square w-full grayscale group-hover:grayscale-0 transition-all duration-700">
                        <Image
                          src="https://picsum.photos/seed/earth/800/800"
                          alt="Atmospheric view of planet earth from space"
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="mt-6">
                        <h4 className="text-white text-sm font-light tracking-widest">
                          寂靜軌道
                        </h4>
                        <p className="text-slate-500 text-xs mt-2 font-light">
                          Silent Orbit
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="pt-4 mt-20 mb-32">
                  <div className="star-map-line mb-8 opacity-40"></div>
                  <h3 className="text-slate-400 text-xs font-light tracking-[0.3em] uppercase">
                    Recent Stardust
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
                    <div className="relative aspect-[4/5] w-full filter brightness-75 hover:brightness-100 transition-all duration-500">
                      <Image
                        src="https://picsum.photos/seed/star1/600/750"
                        alt="Recent stardust 1"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="relative aspect-[4/5] w-full filter brightness-75 hover:brightness-100 transition-all duration-500">
                      <Image
                        src="https://picsum.photos/seed/star2/600/750"
                        alt="Recent stardust 2"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="relative aspect-[4/5] w-full filter brightness-75 hover:brightness-100 transition-all duration-500">
                      <Image
                        src="https://picsum.photos/seed/star3/600/750"
                        alt="Recent stardust 3"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </main>

            <footer className="mt-auto py-12 px-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[10px] text-slate-600 tracking-widest uppercase">
                © Project Memories MMXXIV
              </p>
              <div className="flex gap-8">
                <a
                  className="text-[10px] text-slate-600 hover:text-white transition-colors tracking-widest uppercase"
                  href="#"
                >
                  Privacy
                </a>
                <a
                  className="text-[10px] text-slate-600 hover:text-white transition-colors tracking-widest uppercase"
                  href="#"
                >
                  Archive
                </a>
                <a
                  className="text-[10px] text-slate-600 hover:text-white transition-colors tracking-widest uppercase"
                  href="#"
                >
                  Identity
                </a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
