
'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Movie } from '@/lib/types';
import { MovieList } from './movie-list';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { Pagination } from './pagination';

interface SearchableMovieListProps {
  movies: Movie[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  filterOptions: {
    categories: string[];
    genres: string[];
    years: string[];
  }
}

export function SearchableMovieList({ movies, pagination, filterOptions }: SearchableMovieListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category');
  const selectedGenre = searchParams.get('genre');
  const selectedYear = searchParams.get('year');

  const allCategories = useMemo(() => ['All', ...filterOptions.categories], [filterOptions.categories]);
  const allGenres = useMemo(() => ['All', ...filterOptions.genres], [filterOptions.genres]);
  const allYears = useMemo(() => ['All', ...filterOptions.years], [filterOptions.years]);

  const handleFilterChange = (filterType: 'category' | 'genre' | 'year') => (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'All') {
      params.delete(filterType);
    } else {
      params.set(filterType, value);
    }
    params.set('page', '1'); // Reset to first page on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select onValueChange={handleFilterChange('category')} value={selectedCategory || 'All'}>
                  <SelectTrigger id="category-filter" className="h-12 text-base">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="genre-filter">Genre</Label>
                <Select onValueChange={handleFilterChange('genre')} value={selectedGenre || 'All'}>
                    <SelectTrigger id="genre-filter" className="h-12 text-base">
                        <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                        {allGenres.map(genre => (
                        <SelectItem key={genre} value={genre}>
                            {genre}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="year-filter">Release Year</Label>
                <Select onValueChange={handleFilterChange('year')} value={selectedYear || 'All'}>
                <SelectTrigger id="year-filter" className="h-12 text-base">
                    <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                    {allYears.map(year => (
                    <SelectItem key={year} value={year}>
                        {year}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
        </div>
      </div>

      <MovieList movies={movies} />
      
      <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
    </div>
  );
}
