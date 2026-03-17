import { promises as fs } from 'fs';
import path from 'path';

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  folderName: string;
  type?: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  description: string;
  folderName: string;
}

export interface Series {
  id: string;
  categoryId: string;
  globalSubCatId: string;
  subCategoryId: string;
  seriesId: string;
  title: string;
  story: string;
  date: string;
  location: string;
  coverImage: string;
  images: string[];
}

export interface GalleryData {
  categories: Record<string, Category>;
  subCategories: Record<string, SubCategory>;
  series: Series[];
}

interface CategoryMeta {
  name?: string;
  nameEn?: string;
  type?: string;
}

interface SubCategoryMeta {
  name?: string;
  description?: string;
}

interface SeriesMeta {
  title?: string;
  story?: string;
  date?: string;
  location?: string;
}

interface GalleryDescriptions {
  categories?: Record<string, CategoryMeta>;
  subCategories?: Record<string, string | SubCategoryMeta>;
  series?: Record<string, SeriesMeta | string>;
}

export async function getGalleryData(): Promise<GalleryData> {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery');

  const categories: Record<string, Category> = {};
  const subCategories: Record<string, SubCategory> = {};
  const series: Series[] = [];

  try {
    await fs.access(galleryDir);
  } catch {
    return { categories, subCategories, series };
  }

  // Read descriptions from data.json
  let descriptions: GalleryDescriptions = {};
  try {
    const dataJsonPath = path.join(process.cwd(), 'data', 'gallery.json');
    const fileContents = await fs.readFile(dataJsonPath, 'utf8');
    descriptions = JSON.parse(fileContents);
  } catch (e) {
    // Ignore if data.json doesn't exist or is invalid
  }

  try {
    const level1Entries = (await fs.readdir(galleryDir, { withFileTypes: true }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    for (const l1 of level1Entries) {
      if (!l1.isDirectory()) continue;

      const catNameRaw = l1.name;
      // Rule: Must start with a number followed by space or dot
      const catMatch = catNameRaw.match(/^(\d+)[.\s]+(.*)/);
      if (!catMatch) continue; // Ignore folders like "未整理"

      const catId = catMatch[1];
      const catName = catMatch[2] || catNameRaw;
      const catMeta = descriptions.categories?.[catId];

      categories[catId] = {
        id: catId,
        name: catMeta?.name || catName,
        nameEn: catMeta?.nameEn || catNameRaw,
        folderName: catNameRaw,
        type: catMeta?.type,
      };

      const l1Path = path.join(galleryDir, l1.name);
      const level2Entries = (await fs.readdir(l1Path, { withFileTypes: true }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      for (const l2 of level2Entries) {
        if (!l2.isDirectory()) continue;

        const subCatNameRaw = l2.name;
        // Rule: Must start with "CatId-SubCatId"
        const subCatMatch = subCatNameRaw.match(/^\d+-(\d+)[.\s]*(.*)/);
        if (!subCatMatch) continue; // Ignore folders that don't match the rule

        const subCatId = subCatMatch[1];
        const subCatName = subCatMatch[2] || subCatNameRaw;

        const globalSubCatId = `${catId}-${subCatId}`;
        const subCatDesc = descriptions.subCategories?.[globalSubCatId];
        const description = typeof subCatDesc === 'string'
          ? subCatDesc
          : (subCatDesc as SubCategoryMeta)?.description || '';

        subCategories[globalSubCatId] = {
          id: globalSubCatId, // Use this for routing
          categoryId: catId,
          subCategoryId: subCatId, // The simple number requested by user
          name: (subCatDesc as SubCategoryMeta)?.name || subCatName,
          description,
          folderName: subCatNameRaw
        };

        const l2Path = path.join(l1Path, l2.name);
        const level3Entries = (await fs.readdir(l2Path, { withFileTypes: true }))
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        const seriesMap: Record<string, Series> = {};

        for (const l3 of level3Entries) {
          // Rule: Second level inside MUST be images. Ignore any directories.
          if (l3.isFile() && l3.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            const fileName = l3.name;
            let seriesId = '1'; // Default series ID
            let date = 'Unknown';

            // Parse image name: e.g. 1-1-1-1-20260101.jpg
            // Groups: 1: series, 2: date
            const imgMatch = fileName.match(/^\d+-\d+-(\d+)-\d+-(\d+)/);
            if (imgMatch) {
              seriesId = imgMatch[1];
              date = imgMatch[2];
            } else {
              // Fallback loose match just in case
              const looseMatch = fileName.match(/^\d+-\d+-(\d+)/);
              if (looseMatch) {
                seriesId = looseMatch[1];
              }
            }

            const globalSeriesId = `${globalSubCatId}-${seriesId}`;

            if (!seriesMap[globalSeriesId]) {
              const seriesDesc = descriptions.series?.[globalSeriesId];
              const seriesMeta = typeof seriesDesc === 'object' ? seriesDesc : undefined;
              seriesMap[globalSeriesId] = {
                id: globalSeriesId, // For routing
                categoryId: catId,
                globalSubCatId: globalSubCatId,
                subCategoryId: subCatId,
                seriesId: seriesId, // Simple number
                title: seriesMeta?.title || "",
                story: (typeof seriesDesc === 'string' ? seriesDesc : seriesMeta?.story) || "",
                date: seriesMeta?.date || date,
                location: seriesMeta?.location || "Unknown",
                coverImage: `/gallery/${encodeURIComponent(l1.name)}/${encodeURIComponent(l2.name)}/${encodeURIComponent(fileName)}`,
                images: []
              };
            }

            seriesMap[globalSeriesId].images.push(`/gallery/${encodeURIComponent(l1.name)}/${encodeURIComponent(l2.name)}/${encodeURIComponent(fileName)}`);

            // Update date if we found a valid one and it was unknown
            if (seriesMap[globalSeriesId].date === 'Unknown' && date !== 'Unknown') {
              seriesMap[globalSeriesId].date = date;
            }
          }
        }

        // Add all found series to the main array
        for (const s of Object.values(seriesMap).sort((a, b) => parseInt(a.seriesId) - parseInt(b.seriesId))) {
          if (s.images.length > 0) {
            series.push(s);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error reading gallery directory:", error);
  }

  // Load text-type categories from gallery.json (no filesystem required)
  for (const [catId, catMeta] of Object.entries(descriptions.categories || {})) {
    if (catMeta.type !== 'text' || categories[catId]) continue;

    categories[catId] = {
      id: catId,
      name: catMeta.name || catId,
      nameEn: catMeta.nameEn || catId,
      folderName: '',
      type: 'text',
    };

    // Load subcategories for this text category
    for (const [subCatId, subCatDesc] of Object.entries(descriptions.subCategories || {})) {
      if (!subCatId.startsWith(`${catId}-`)) continue;

      const parts = subCatId.split('-');
      const subId = parts[1];
      const description = typeof subCatDesc === 'string'
        ? subCatDesc
        : (subCatDesc as SubCategoryMeta)?.description || '';
      const subCatName = (subCatDesc as SubCategoryMeta)?.name || subCatId;

      subCategories[subCatId] = {
        id: subCatId,
        categoryId: catId,
        subCategoryId: subId,
        name: subCatName,
        description,
        folderName: '',
      };

      // Load series for this subcategory
      for (const [seriesId, seriesMeta] of Object.entries(descriptions.series || {})) {
        if (!seriesId.startsWith(`${subCatId}-`)) continue;

        const sParts = seriesId.split('-');
        const sId = sParts[2];
        const meta = typeof seriesMeta === 'object' ? seriesMeta as SeriesMeta : undefined;
        const story = typeof seriesMeta === 'string' ? seriesMeta : (meta?.story || '');

        series.push({
          id: seriesId,
          categoryId: catId,
          globalSubCatId: subCatId,
          subCategoryId: subId,
          seriesId: sId,
          title: meta?.title || '',
          story,
          date: meta?.date || 'Unknown',
          location: meta?.location || 'Unknown',
          coverImage: '',
          images: [],
        });
      }
    }
  }

  // Sort all series so text-category series appear in a consistent order
  series.sort((a, b) => {
    const aKey = `${a.categoryId}-${a.globalSubCatId}-${a.seriesId}`;
    const bKey = `${b.categoryId}-${b.globalSubCatId}-${b.seriesId}`;
    return aKey.localeCompare(bKey, undefined, { numeric: true });
  });

  return { categories, subCategories, series };
}
