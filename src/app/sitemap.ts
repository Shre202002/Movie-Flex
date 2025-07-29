import { MetadataRoute } from 'next';

const URL = 'https://allmoviesdownload.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  return [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
