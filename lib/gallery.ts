import { promises as fs, Dirent } from 'fs';
import path from 'path';

export interface GalleryData {
  categories: Record<string, any>;
  subCategories: Record<string, any>;
  series: any[];
}

export async function getGalleryData(): Promise<GalleryData> {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery');
  
  const categories: Record<string, any> = {};
  const subCategories: Record<string, any> = {};
  const series: any[] = [];

  try {
    await fs.access(galleryDir);
  } catch {
    return { categories, subCategories, series };
  }

  // Read descriptions from data.json
  let descriptions: { categories?: Record<string, any>, subCategories?: Record<string, string>, series?: Record<string, string> } = {};
  try {
    const dataJsonPath = path.join(galleryDir, 'data.json');
    const fileContents = await fs.readFile(dataJsonPath, 'utf8');
    descriptions = JSON.parse(fileContents);
  } catch (e) {
    // Ignore if data.json doesn't exist or is invalid
  }

  try {
    const level1Entries = await fs.readdir(galleryDir, { withFileTypes: true });
    
    for (const l1 of level1Entries) {
      if (!l1.isDirectory()) continue;
      
      const catNameRaw = l1.name;
      // Rule: Must start with a number followed by space or dot
      const catMatch = catNameRaw.match(/^(\d+)[.\s]+(.*)/);
      if (!catMatch) continue; // Ignore folders like "未整理"
      
      const catId = catMatch[1];
      const catName = catMatch[2] || catNameRaw;
      
      categories[catId] = {
        id: catId,
        name: descriptions.categories?.[catId]?.name || catName,
        nameEn: descriptions.categories?.[catId]?.nameEn || catNameRaw,
        folderName: catNameRaw
      };
      
      const l1Path = path.join(galleryDir, l1.name);
      const level2Entries = await fs.readdir(l1Path, { withFileTypes: true });
      
      for (const l2 of level2Entries) {
        if (!l2.isDirectory()) continue;
        
        const subCatNameRaw = l2.name;
        // Rule: Must start with "CatId-SubCatId"
        const subCatMatch = subCatNameRaw.match(/^\d+-(\d+)[.\s]*(.*)/);
        if (!subCatMatch) continue; // Ignore folders that don't match the rule
        
        const subCatId = subCatMatch[1];
        const subCatName = subCatMatch[2] || subCatNameRaw;
        
        const globalSubCatId = `${catId}-${subCatId}`;
        
        subCategories[globalSubCatId] = {
          id: globalSubCatId, // Use this for routing
          categoryId: catId,
          subCategoryId: subCatId, // The simple number requested by user
          name: subCatName,
          description: descriptions.subCategories?.[globalSubCatId] || "", // Only from data.json
          folderName: subCatNameRaw
        };
        
        const l2Path = path.join(l1Path, l2.name);
        const level3Entries = await fs.readdir(l2Path, { withFileTypes: true });
        
        const seriesMap: Record<string, any> = {};
        
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
              seriesMap[globalSeriesId] = {
                id: globalSeriesId, // For routing
                categoryId: catId,
                globalSubCatId: globalSubCatId,
                subCategoryId: subCatId,
                seriesId: seriesId, // Simple number
                title: `${subCatName}`,
                subtitle: `Series ${seriesId}`,
                story: descriptions.series?.[globalSeriesId] || "", // Only from data.json
                date: date,
                location: "Unknown",
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
        for (const s of Object.values(seriesMap)) {
          if (s.images.length > 0) {
            series.push(s);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error reading gallery directory:", error);
  }

  return { categories, subCategories, series };
}
