
import { getMovies } from '@/lib/data';
import { SearchableMovieList } from '@/components/searchable-movie-list';

export default async function HomePage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const page = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1;
  const pageSize = 30;

  const { movies, totalMovies } = await getMovies({ page, pageSize });
  const { movies: allMoviesForFilter } = await getMovies({ getAll: true });
  
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
        initialMovies={movies} 
        allMoviesForFilter={allMoviesForFilter}
        pagination={{ currentPage: page, totalPages }} 
      />
    </main>
  );
}
