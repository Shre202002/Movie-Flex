
import { db, db2 } from './firebase';
import { collection, getDocs, doc, getDoc, query, where, limit, orderBy, startAfter, documentId, getCountFromServer } from 'firebase/firestore';
import type { Movie, FirestoreMovieData } from './types';
import { slugify } from './utils';

// Cache individual movies, but not the whole list for pagination
const singleMovieCache: Map<string, Movie> = new Map();
let allMoviesCache: Movie[] | null = null;
let allMoviesCacheTime: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function mapFirestoreDocToMovie(doc: any): Movie {
    const firestoreData = doc.data() as FirestoreMovieData;
    const movieData = firestoreData.data;

    return {
        id: doc.id,
        slug: firestoreData.slug || slugify(firestoreData.title),
        title: firestoreData.title,
        posterUrl: firestoreData.image_src,
        releaseDate: movieData.release,
        rating: parseFloat(movieData.imdb?.split('/')[0]) || 0,
        genre: movieData.genre || [],
        director: Array.isArray(movieData.director) ? movieData.director.join(', ') : movieData.director,
        actors: movieData.actors || [],
        plot: movieData.description,
        language: movieData.country,
        quality: firestoreData.quality,
        size: '', 
        streamUrl: movieData.stream_online_link?.link,
        downloadLinks: movieData.gdrive_links?.reduce((acc, link) => {
            if(link.title && link.link) {
              acc[link.title] = link.link;
            }
            return acc;
        }, {} as { [key: string]: string }) || {},
        category: firestoreData.category,
        trailerId: movieData.trailer_id || null,
    };
}

export async function getMovies({ page = 1, pageSize = 30, getAll = false, category, genre, year }: { page?: number; pageSize?: number, getAll?: boolean, category?: string | null, genre?: string | null, year?: string | null }): Promise<{movies: Movie[], totalMovies: number}> {
  try {
    const now = Date.now();
    // Caching for 'getAll' is complex with filters, so we disable it when filters are active.
    if (getAll && !category && !genre && !year && allMoviesCache && allMoviesCacheTime && (now - allMoviesCacheTime < CACHE_DURATION)) {
      return { movies: allMoviesCache, totalMovies: allMoviesCache.length };
    }

    const moviesCollection = collection(db, 'movies');
    
    const constraints = [];
    if (category) {
        constraints.push(where('category', '==', category));
    }
    if (genre) {
        constraints.push(where('data.genre', 'array-contains', genre));
    }
    if (year) {
        // Firestore doesn't support querying by year directly from a date string. 
        // This requires either a dedicated 'year' field or client-side filtering.
        // For now, we will rely on client-side filtering for year if a dedicated field is not present.
        // This is a placeholder for a more robust solution.
    }


    if (getAll) {
      const q = query(moviesCollection, orderBy('data.release', 'desc'), ...constraints);
      const movieSnapshot = await getDocs(q);
      const movies = movieSnapshot.docs.map(mapFirestoreDocToMovie);
      if(!category && !genre && !year) {
        allMoviesCache = movies;
        allMoviesCacheTime = now;
      }
      movies.forEach(movie => {
        singleMovieCache.set(movie.id, movie);
        singleMovieCache.set(movie.slug, movie);
      });
      return { movies, totalMovies: movies.length };
    }
    
    const countQuery = query(moviesCollection, ...constraints);
    const countSnapshot = await getCountFromServer(countQuery);
    const totalMovies = countSnapshot.data().count;

    let q = query(moviesCollection, orderBy('data.release', 'desc'), ...constraints, limit(pageSize));

    if (page > 1) {
      const first = query(moviesCollection, orderBy('data.release', 'desc'), ...constraints, limit(pageSize * (page - 1)));
      const documentSnapshots = await getDocs(first);
      const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      if (lastVisible) {
        q = query(moviesCollection, orderBy('data.release', 'desc'), ...constraints, startAfter(lastVisible), limit(pageSize));
      }
    }
    
    const movieSnapshot = await getDocs(q);
    const movies: Movie[] = movieSnapshot.docs.map(mapFirestoreDocToMovie);

    movies.forEach(movie => {
      singleMovieCache.set(movie.id, movie);
      singleMovieCache.set(movie.slug, movie);
    });

    return { movies, totalMovies };
  } catch (error) {
    console.error("Failed to fetch movies from Firestore", error);
    return { movies: [], totalMovies: 0 };
  }
}

export async function getFilterOptions(): Promise<{ categories: string[]; genres: string[]; years: string[] }> {
    try {
        const filterDocRef = doc(db, 'filter', 'filterDoc');
        const filterDoc = await getDoc(filterDocRef);

        if (!filterDoc.exists()) {
            console.warn("Filter document 'filterDoc' not found!");
            return { categories: [], genres: [], years: [] };
        }

        const data = filterDoc.data();
        
        return {
            categories: data?.category || [],
            genres: data?.genre || [],
            years: data?.release || [],
        };
    } catch (error) {
        console.error("Failed to fetch filter options from Firestore", error);
        return { categories: [], genres: [], years: [] };
    }
}


export async function getAllMoviesForFilter(): Promise<Movie[]> {
  const { movies } = await getMovies({ getAll: true });
  return movies;
}


export async function getMovieById(id: string): Promise<Movie | undefined> {
  if (singleMovieCache.has(id)) {
      return singleMovieCache.get(id);
  }

  try {
    const movieDocRef = doc(db, 'movies', id);
    const movieDoc = await getDoc(movieDocRef);

    if (!movieDoc.exists()) {
      return undefined;
    }
    const movie = mapFirestoreDocToMovie(movieDoc);
    singleMovieCache.set(movie.id, movie);
    singleMovieCache.set(movie.slug, movie);
    return movie;

  } catch (error) {
    console.error(`Failed to fetch movie with id ${id} from Firestore`, error);
    return undefined;
  }
}

export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
  if (singleMovieCache.has(slug)) {
    return singleMovieCache.get(slug);
  }
  
  try {
    const moviesCollection = collection(db, 'movies');
    const q = query(moviesCollection, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`No movie found with slug: ${slug}`);
      return undefined;
    }

    const movieDoc = querySnapshot.docs[0];
    const movie = mapFirestoreDocToMovie(movieDoc);
    singleMovieCache.set(movie.id, movie);
    singleMovieCache.set(movie.slug, movie);
    return movie;

  } catch (error) {
    console.error(`Failed to fetch movie with slug ${slug} from Firestore`, error);
    return undefined;
  }
}

export async function getSimilarMovies({ genre, currentMovieId }: { genre: string, currentMovieId: string }): Promise<Movie[]> {
  if (!genre) return [];

  try {
    const moviesCollection = collection(db, 'movies');
    const q = query(
      moviesCollection,
      where('data.genre', 'array-contains', genre),
      limit(6) // Fetch a few more to filter out the current one
    );
    const querySnapshot = await getDocs(q);
    const similarMovies = querySnapshot.docs
      .map(mapFirestoreDocToMovie)
      .filter(movie => movie.id !== currentMovieId)
      .slice(0, 5); // Return 5 movies

    return similarMovies;
  } catch (error) {
    console.error('Failed to fetch similar movies:', error);
    return [];
  }
}

export async function getRandomBlog(){
  
  const domain = "https://www.aimlinfo.in"
  try {
    
    const collectionRef = collection(db2, 'posts'); // Replace 'posts' with your collection name

    // 1. Get total number of posts
    const countSnap = await getCountFromServer(collectionRef);
    const totalPost = countSnap.data().count;
    console.log("total post", totalPost)
    if (totalPost===0) {
      return domain;
    }

    //2. Generate random post number between 1 and totalPost
    const randomPostNo = Math.floor(Math.random() * totalPost) + 1;

     // 3. Query Firestore where post_no == randomPostNo
  const q = query(
    collectionRef,
    where('post_no', '==', randomPostNo),
    limit(1)
  );

  const snapshot = await getDocs(q);
  const doc = snapshot.docs[0];

  return doc ? domain+"/posts/"+doc.data().slug : domain;
    

  } catch (error) {
    console.error('Error fetching random post:', error);
    return domain;
  } 
}

export async function getMovieSiteLink(){
  const siteDocRef  = doc(db, 'urls', 'AYLjWyyQBd4wYev1NTKr');
  const siteDoc = await getDoc(siteDocRef);
  // if (!siteDoc.exists()){return undefined};
  const siteName = siteDoc.data()?.movie_site
  // console.log(siteDoc.data())
  return siteName;
}
