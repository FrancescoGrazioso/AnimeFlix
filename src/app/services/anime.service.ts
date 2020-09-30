import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment, mainURL} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {Animes} from '../models/animes';

const enum endpoint {
  popular = '/movie/popular',
  trending = '/trending/all/week'
}

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private URL = 'https://api.themoviedb.org/3';
  // tslint:disable-next-line:variable-name
  private api_key = environment.api;

  private mainURLS = mainURL;
  titleList: string[] = [];
  episodesList: string[] = [];

  constructor(private http: HttpClient) {
  }

  getPopularAnimes(): Observable<Animes> {
    return this.http.get<Animes>(`${this.URL}${endpoint.popular}`, {
      params: {
        api_key: this.api_key
      }
    });
  }

  populateAnimeEpisodes(title: string) {
    this.http.get(this.mainURLS.animeislife + 'DDL/ANIME/' + title + '/', {responseType: 'text'}).subscribe(
      t => {
        let htmlPage = t;
        htmlPage = htmlPage.slice(htmlPage.indexOf('<li>'), htmlPage.indexOf('</ul>'));
        this.episodesList = htmlPage.split('<li>');
        this.episodesList.reverse().pop();
        this.episodesList.reverse();
        for (let link of this.episodesList) {
          link = link.slice(link.indexOf('/http') + 1, link.indexOf(' target') - 1);
          console.log(link);
        }
      }
    );
  }

  populateAnimeList() {
    // tslint:disable-next-line:forin
    for (const key in this.mainURLS) {
      this.http.get(this.mainURLS[key] + 'DDL/ANIME/', {responseType: 'text'}).subscribe(
        t => {
          let htmlPage = t;
          htmlPage = htmlPage.slice(htmlPage.indexOf('<li>'), htmlPage.indexOf('</ul>'));
          const tmpList = htmlPage.split('<li>');
          tmpList.pop();
          for (let link of tmpList) {
            link = link.slice(link.indexOf('\'>') + 2, link.indexOf('</a'));
            this.titleList.push(link);
          }
        }
      );
    }
  }

  getTrending(): Observable<Animes> {
    return this.http.get<Animes>(`${this.URL}${endpoint.trending}`, {
      params: {
        api_key: this.api_key
      }
    });
  }

}
