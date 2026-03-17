import GalleryClient from './GalleryClient';
import { getGalleryData } from '@/lib/gallery';

export const dynamic = 'force-dynamic';

export default async function Gallery() {
  const data = await getGalleryData();

  return <GalleryClient data={data} />;
}
