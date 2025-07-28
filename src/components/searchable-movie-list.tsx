
'use client';

import { useState, useMemo, useEffect } from 'react';
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
  initialMovies: Movie[];
  allMoviesForFilter: Movie[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

const PAGE_SIZE = 30;

export function SearchableMovieList({ initialMovies, allMoviesForFilter, pagination }: SearchableMovieListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    allMoviesForFilter.forEach(movie => {
      if (movie.genre && Array.isArray(movie.genre)) {
        movie.genre.forEach(g => genres.add(g.trim()));
      }
    });
    return ['All', ...Array.from(genres).sort()];
  }, [allMoviesForFilter]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    allMoviesForFilter.forEach(movie => {
        if(movie.category) {
            categories.add(movie.category);
        }
    });
    return ['All', ...Array.from(categories).sort()];
  }, [allMoviesForFilter]);

  const allYears = useMemo(() => {
    const years = new Set<string>();
    allMoviesForFilter.forEach(movie => {
        if(movie.releaseDate) {
            const year = new Date(movie.releaseDate).getFullYear().toString();
            if(!isNaN(parseInt(year))) {
                 years.add(year);
            }
        }
    });
    return ['All', ...Array.from(years).sort((a,b) => b.localeCompare(a))];
  }, [allMoviesForFilter]);

  const hasActiveFilters = useMemo(() => {
     return !!(searchTerm || (selectedCategory && selectedCategory !== 'All') || (selectedGenre && selectedGenre !== 'All') || (selectedYear && selectedYear !== 'All'));
  }, [searchTerm, selectedCategory, selectedGenre, selectedYear]);
  
  const filteredMovies = useMemo(() => {
    let sourceMovies = hasActiveFilters ? allMoviesForFilter : initialMovies;

    let result = sourceMovies;

    if (selectedCategory && selectedCategory !== 'All') {
        result = result.filter(movie => movie.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedGenre && selectedGenre !== 'All') {
      result = result.filter(movie =>
        movie.genre && Array.isArray(movie.genre) && movie.genre.map(g => g.toLowerCase()).includes(selectedGenre.toLowerCase())
      );
    }
    
    if (selectedYear && selectedYear !== 'All') {
        result = result.filter(movie => movie.releaseDate && new Date(movie.releaseDate).getFullYear().toString() === selectedYear);
    }

    if (searchTerm) {
      result = result.filter(
        movie =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (movie.director && movie.director.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return result;
  }, [initialMovies, allMoviesForFilter, searchTerm, selectedGenre, selectedCategory, selectedYear, hasActiveFilters]);

  const totalPages = hasActiveFilters ? Math.ceil(filteredMovies.length / PAGE_SIZE) : pagination.totalPages;
  
  const paginatedMovies = useMemo(() => {
    if (hasActiveFilters) {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredMovies.slice(startIndex, startIndex + PAGE_SIZE);
    }
    return initialMovies;
  }, [filteredMovies, currentPage, hasActiveFilters, initialMovies]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string | null>>) => (value: string) => {
    setter(value === 'All' ? null : value);
    setCurrentPage(1);
  };
  
  if (!isClient) {
    return (
      <div className="space-y-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Skeleton placeholders can be added here */}
        </div>
        <MovieList movies={initialMovies} />
         {!hasActiveFilters && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => {}}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select onValueChange={handleFilterChange(setSelectedCategory)} defaultValue={selectedCategory || 'All'}>
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
                <Select onValueChange={handleFilterChange(setSelectedGenre)} defaultValue={selectedGenre || 'All'}>
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
                <Select onValueChange={handleFilterChange(setSelectedYear)} defaultValue={selectedYear || 'All'}>
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

      <MovieList movies={hasActiveFilters ? paginatedMovies : initialMovies} />
      
      <Pagination
          currentPage={hasActiveFilters ? currentPage : pagination.currentPage}
          totalPages={totalPages}
          onPageChange={hasActiveFilters ? setCurrentPage : undefined}
        />
    </div>
  );
}
