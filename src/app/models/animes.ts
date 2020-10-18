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


export interface Animes {
  results: Anime[];
  lenght?: number;
}
