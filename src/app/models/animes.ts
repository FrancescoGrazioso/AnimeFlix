import {DocumentData} from '@angular/fire/firestore';

export class Anime {
  realTitle: string;
  key: string;
  views: number;
  rating: {
    numberOfRating: number;
    review: number;
  };
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

  constructor(doc: DocumentData) {
    this.realTitle = doc.realTitle;
    this.key = doc.key;
    this.views = doc.views;
    this.rating = doc.rating;
    this.results = doc.results;
  }
}


export interface Animes {
  results: Anime[];
  lenght?: number;
}
