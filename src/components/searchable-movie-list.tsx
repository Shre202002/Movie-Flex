
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
import { getMovies } from '@/lib/data';

interface SearchableMovieListProps {
  initialMovies: Movie[];
  allMoviesForFilter: Movie[];
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

const PAGE_SIZE = 30;

export function SearchableMovieList({ initialMovies, allMoviesForFilter, pagination, filterOptions }: SearchableMovieListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState(initialMovies)
  const [totalPages, setTotalPages] = useState(pagination.totalPages)

  useEffect(() => {
    setIsClient(true);
  }, []);

  const allGenres = useMemo(() => ['All', ...filterOptions.genres], [filterOptions.genres]);
  const allCategories = useMemo(() => ['All', ...filterOptions.categories], [filterOptions.categories]);
  const allYears = useMemo(() => ['All', ...filterOptions.years], [filterOptions.years]);
  
  const hasActiveFilters = useMemo(() => {
     return !!(searchTerm || (selectedCategory && selectedCategory !== 'All') || (selectedGenre && selectedGenre !== 'All') || (selectedYear && selectedYear !== 'All'));
  }, [searchTerm, selectedCategory, selectedGenre, selectedYear]);

  const filteredMovies = useMemo(() => {
    let sourceMovies = hasActiveFilters ? allMoviesForFilter : initialMovies;

    let result = sourceMovies;
    if (hasActiveFilters) {
        
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
    }


    return result;
  }, [initialMovies, allMoviesForFilter, searchTerm, selectedGenre, selectedCategory, selectedYear, hasActiveFilters]);

  
  const paginatedMovies = useMemo(() => {
    if (hasActiveFilters) {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredMovies.slice(startIndex, startIndex + PAGE_SIZE);
    }
    return initialMovies;
  }, [filteredMovies, currentPage, hasActiveFilters, initialMovies]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string | null>>) => async (value: string) => {
    const filterValue = value === 'All' ? null : value;
    setter(filterValue);
    setCurrentPage(1);

    const {movies: newMovies, totalMovies: newTotalMovies} = await getMovies({
        page: 1,
        pageSize: PAGE_SIZE,
        genre: selectedGenre,
        category: selectedCategory,
        year: selectedYear
    })
    setMovies(newMovies)
    setTotalPages(Math.ceil(newTotalMovies / PAGE_SIZE))
  };

    const handlePageChange = async (page: number) => {
        if (hasActiveFilters) {
            setCurrentPage(page);
        } else {
            const { movies: newMovies } = await getMovies({
                page,
                pageSize: PAGE_SIZE,
                genre: selectedGenre,
                category: selectedCategory,
                year: selectedYear
            });
            setMovies(newMovies);
            setCurrentPage(page);
        }
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

      <MovieList movies={hasActiveFilters ? paginatedMovies : movies} />
      
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
    </div>
  );
}
