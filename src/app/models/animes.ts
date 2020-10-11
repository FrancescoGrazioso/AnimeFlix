export interface Anime {
  realTitle: string;
  key: string;
  request_hash: string;
  request_cached: boolean;
  request_cache_expiry: number;
  results: [
    {
      mal_id: number;
      url: string;
      image_url: string;
      title: string;
      airing: boolean;
      synopsis: string;
      type: string;
      episodes: number;
      score: number;
      start_date: string;
      end_date: string;
      members: number;
      rated: string
    }
  ];
  last_page: number;
}
/*export interface Anime {
  realTitle: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: [
    {
      Source: string;
      Value: string;
    }
  ];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons: string;
  Response: string;
}*/

export interface Animes {
  results: Anime[];
  lenght?: number;
}
