
import { getMovies, getFilterOptions } from '@/lib/data';
import { SearchableMovieList } from '@/components/searchable-movie-list';

export default async function HomePage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1;
  const category = typeof searchParams?.category === 'string' ? searchParams.category : null;
  const genre = typeof searchParams?.genre === 'string' ? searchParams.genre : null;
  const year = typeof searchParams?.year === 'string' ? searchParams.year : null;
  const pageSize = 30;

  const { movies, totalMovies } = await getMovies({ page, pageSize, category, genre, year });
  const { categories, genres, years } = await getFilterOptions();
  
  const totalPages = Math.ceil(totalMovies / pageSize);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-2 text-primary">All Movies Download</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of the latest and old movies. Use the search and filters to find your next favorite film.
        </p>
      </div>
      <SearchableMovieList 
        movies={movies} 
        pagination={{ currentPage: page, totalPages }}
        filterOptions={{ categories, genres, years }}
      />
    </main>
  );
}
