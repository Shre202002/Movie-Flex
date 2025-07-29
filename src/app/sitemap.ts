import { getMovies } from '@/lib/data';
import { MetadataRoute } from 'next';

const URL = 'https://allmoviesdownload.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { movies } = await getMovies({ pageSize: 10000 }); // Fetch all movies, adjust pageSize as needed

  const movieEntries: MetadataRoute.Sitemap = movies.map((movie) => ({
    url: `${URL}/movies/${movie.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...movieEntries,
  ];
}
