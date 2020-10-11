import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { mainURL} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {Anime, Animes} from '../models/animes';

const enum endpoint {
  popular = '/movie/popular',
  trending = '/trending/all/week'
}

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private URL = 'https://api.themoviedb.org/3';
  private APIURL = 'http://www.omdbapi.com/';
  // tslint:disable-next-line:variable-name

  private mainURLS = mainURL;

  constructor(private http: HttpClient) {
  }

  populateAnimeEpisodes(key: string, title: string) {
    return this.http.get(this.mainURLS[key] + '/DDL/ANIME/' + title + '/', {responseType: 'text'});
  }

  populateAnimeList(key: string) {
    // tslint:disable-next-line:forin
    return this.http.get(this.mainURLS[key] + 'DDL/ANIME/', {responseType: 'text'});
  }

  getAnimeInfo(title: string) {
    return this.http.get<Anime>('https://api.jikan.moe/v3/search/anime?q=' + title + '&limit=1');
  }

}
