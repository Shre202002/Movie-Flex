export interface Movie {
  id: string;
  slug: string;
  title: string;
  posterUrl: string;
  releaseDate: string;
  rating: number;
  genre: string[];
  director: string;
  actors: string[];
  plot: string;
  language: string;
  quality: string;
  size: string;
  streamUrl: string;
  downloadLinks: { [key: string]: string };
  category: string;
  trailerId: string | null;
}

export interface FirestoreMovieData {
    id: string;
    slug: string;
    title: string;
    image_src: string;
    quality: string;
    category: string;
    movie_id: string;
    data: {
        title: string;
        genre: string[];
        director: string[] | string;
        actors: string[];
        country: string;
        duration: string;
        quality: string;
        release: string;
        imdb: string;
        votes: string;
        review: string;
        description: string;
        trailer_id?: string | null;
        stream_online_link?: {
            title: string;
            link: string;
        };
        gdrive_links?: {
            title: string;
            link: string;
        }[];
    };
}
