"use client"
import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';

import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Highlight, useSearchBox, useInstantSearch, Configure, RefinementList } from 'react-instantsearch';
// import 'instantsearch.css/themes/satellite.css';
import Image from 'next/image'

const searchClient = algoliasearch(`${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}`, `${process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY}`);

const Hit = ({ hit }: any) => (
  <a href={`/movies/${hit.objectID}`}>
  <article className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-md transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <Image
      src={hit.image_src}
      alt={hit.title}
      width={50}
      height={100}
      className="hidden sm:block h-auto object-cover rounded-md border border-gray-300 dark:border-gray-600"
    />
    <div className="flex flex-col justify-between">
      <h1 className="sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
        <Highlight attribute="data.title" hit={hit} />
      </h1>
      <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Genre:</span>{' '}
        <Highlight attribute="data.genre" hit={hit} />
      </p>
      <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Actors:</span>{' '}
        <Highlight attribute="data.actors" hit={hit} />
      </p>
    </div>
  </article>
  </a>
);


export function Header() {

  function CustomHits() {
    const { query } = useSearchBox();
    const { results } = useInstantSearch();

    if (!query) return null;

    if (results?.hits.length === 0) {
      return (
        <p className="absolute top-12 text-gray-600 dark:text-gray-400 text-center">
          No results found.
        </p>
      );
    }
    return (
      <div className="absolute top-12">
        <Hits hitComponent={Hit} />
      </div>
    );
  }



  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <Clapperboard className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-[-15deg]" />
          <span className="text-xl font-bold font-headline text-foreground transition-colors group-hover:text-primary">
            Kiwi Cinema
          </span>
        </Link>

        <InstantSearch searchClient={searchClient} indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}>
          <Configure hitsPerPage={5} /> {/* 👈 LIMIT RESULTS TO 5 */}
          <div className="w-full max-w-[900px] mx-auto p-4 space-y-4">
            <div className="relative w-full">
              <SearchBox
                placeholder="Search movies, genres, actors..."
                classNames={{
                  root: '',
                  form: 'relative',
                  input:
                    'w-full h-12 pl-10 mt-4 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500',
                  submit: 'hidden',
                }}
              />
              <SearchIcon
                className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
              <RefinementList attribute="data.release" />
            <CustomHits />

          </div>
        </InstantSearch>

        
      </div>
    </header>
  );
}
