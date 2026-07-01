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
  coverDescription: string;
  folderName: string;
  date?: string;
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
  mdContent: string;
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
  coverDescription?: string;
  date?: string;
}

interface SeriesMeta {
  title?: string;
  story?: string;
  date?: string;
  location?: string;
}

interface GalleryDescriptions {
  categories?: Record<string, CategoryMeta>;
  subCategories?: Record<string, SubCategoryMeta>;
  series?: Record<string, SeriesMeta | string>;
}

export async function getGalleryData(): Promise<GalleryData> {
  const galleryDir = process.env.GALLERY_PATH ?? path.join(process.cwd(), 'public', 'gallery');

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
    const dataJsonPath = path.join(galleryDir, 'gallery.json');
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
        const coverDescription = subCatDesc?.coverDescription || '';

        subCategories[globalSubCatId] = {
          id: globalSubCatId, // Use this for routing
          categoryId: catId,
          subCategoryId: subCatId, // The simple number requested by user
          name: subCatDesc?.name || subCatName,
          coverDescription,
          folderName: subCatNameRaw,
          date: subCatDesc?.date,
        };

        const l2Path = path.join(l1Path, l2.name);

        // JSON coverDescription has priority; fallback to description.md when empty.
        if (!subCategories[globalSubCatId].coverDescription.trim()) {
          try {
            const descriptionFile = path.join(l2Path, 'description.md');
            const descriptionContent = await fs.readFile(descriptionFile, 'utf8');
            subCategories[globalSubCatId].coverDescription = descriptionContent;
          } catch {
            // Ignore missing description.md.
          }
        }

        const level3Entries = (await fs.readdir(l2Path, { withFileTypes: true }))
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        const seriesMap: Record<string, Series> = {};

        for (const l3 of level3Entries) {
          if (!l3.isFile()) continue;
          const fileName = l3.name;

          if (fileName.toLowerCase() === 'description.md') continue;

          if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            // --- Image file ---
            let seriesId = '1';
            let date = 'Unknown';

            const imgMatch = fileName.match(/^\d+-\d+-(\d+)-\d+-(\d+)/);
            if (imgMatch) {
              seriesId = imgMatch[1];
              date = imgMatch[2];
            } else {
              const looseMatch = fileName.match(/^\d+-\d+-(\d+)/);
              if (looseMatch) seriesId = looseMatch[1];
            }

            const globalSeriesId = `${globalSubCatId}-${seriesId}`;

            if (!seriesMap[globalSeriesId]) {
              const seriesDesc = descriptions.series?.[globalSeriesId];
              const seriesMeta = typeof seriesDesc === 'object' ? seriesDesc : undefined;
              seriesMap[globalSeriesId] = {
                id: globalSeriesId,
                categoryId: catId,
                globalSubCatId: globalSubCatId,
                subCategoryId: subCatId,
                seriesId: seriesId,
                title: seriesMeta?.title || "",
                story: (typeof seriesDesc === 'string' ? seriesDesc : seriesMeta?.story) || "",
                date: seriesMeta?.date || date,
                location: seriesMeta?.location || "Unknown",
                coverImage: `/api/gallery/${encodeURIComponent(l1.name)}/${encodeURIComponent(l2.name)}/${encodeURIComponent(fileName)}`,
                images: [],
                mdContent: "",
              };
            }

            seriesMap[globalSeriesId].images.push(`/api/gallery/${encodeURIComponent(l1.name)}/${encodeURIComponent(l2.name)}/${encodeURIComponent(fileName)}`);

            if (seriesMap[globalSeriesId].date === 'Unknown' && date !== 'Unknown') {
              seriesMap[globalSeriesId].date = date;
            }

          } else if (fileName.match(/\.md$/i)) {
            // --- Markdown file ---
            let seriesId = '1';
            let date = 'Unknown';

            const mdMatch = fileName.match(/^\d+-\d+-(\d+)-\d+-(\d+)/);
            if (mdMatch) {
              seriesId = mdMatch[1];
              date = mdMatch[2];
            } else {
              const looseMatch = fileName.match(/^\d+-\d+-(\d+)/);
              if (looseMatch) seriesId = looseMatch[1];
            }

            const globalSeriesId = `${globalSubCatId}-${seriesId}`;
            const fileContent = await fs.readFile(path.join(l2Path, fileName), 'utf8');

            if (!seriesMap[globalSeriesId]) {
              const seriesDesc = descriptions.series?.[globalSeriesId];
              const seriesMeta = typeof seriesDesc === 'object' ? seriesDesc as SeriesMeta : undefined;
              const jsonStory = typeof seriesDesc === 'string' ? seriesDesc : seriesMeta?.story;
              seriesMap[globalSeriesId] = {
                id: globalSeriesId,
                categoryId: catId,
                globalSubCatId: globalSubCatId,
                subCategoryId: subCatId,
                seriesId: seriesId,
                title: seriesMeta?.title || "",
                story: jsonStory || "",
                mdContent: fileContent,
                date: seriesMeta?.date || date,
                location: seriesMeta?.location || "Unknown",
                coverImage: "",
                images: [],
              };
            } else {
              seriesMap[globalSeriesId].mdContent = fileContent;
              if (seriesMap[globalSeriesId].date === 'Unknown' && date !== 'Unknown') {
                seriesMap[globalSeriesId].date = date;
              }
            }
          }
        }

        // Add all found series to the main array
        for (const s of Object.values(seriesMap).sort((a, b) => parseInt(a.seriesId) - parseInt(b.seriesId))) {
          if (s.images.length > 0 || s.story || s.mdContent) {
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
      const coverDescription = subCatDesc.coverDescription || '';
      const subCatName = subCatDesc.name || subCatId;

      subCategories[subCatId] = {
        id: subCatId,
        categoryId: catId,
        subCategoryId: subId,
        name: subCatName,
        coverDescription,
        folderName: '',
        date: subCatDesc.date,
      };

      // Load series for this subcategory
      for (const [seriesId, seriesMeta] of Object.entries(descriptions.series || {})) {
        if (!seriesId.startsWith(`${subCatId}-`)) continue;
        if (series.some(s => s.id === seriesId)) continue;

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
          mdContent: '',
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
