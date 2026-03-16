import GalleryClient from './GalleryClient';
import { getGalleryData } from '@/lib/gallery';

export default async function Gallery() {
  const data = await getGalleryData();

  return <GalleryClient data={data} />;
}
