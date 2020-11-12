import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { mainURL} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {Anime, Animes} from '../models/animes';
import {User} from '../models/user';
import {AngularFireDatabase} from '@angular/fire/database';
import {WatchingResume} from '../models/watchingResume';

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

  constructor(private http: HttpClient,
              private  af: AngularFireDatabase ) {
  }

  populateAnimeEpisodes(key: string, title: string) {
    return this.http.get('https://cors-anywhere.herokuapp.com/' + this.mainURLS[key] + '/DDL/ANIME/' + title + '/', {responseType: 'text'});
  }

  populateAnimeList(key: string) {
    // tslint:disable-next-line:forin
    return this.http.get('https://cors-anywhere.herokuapp.com/' + this.mainURLS[key] + 'DDL/ANIME/', {responseType: 'text'});
  }

  getAnimeInfo(title: string) {
    return this.http.get<Anime>('https://cors-anywhere.herokuapp.com/' + 'https://api.jikan.moe/v3/search/anime?q=' + title + '&limit=1');
  }

  uploadEpisodeStatus(user: User, animeTitle: string, videoUrl: string, index: number, currentTime: number) {
    const data: WatchingResume = {
      uid: user.uid,
      animeTitle,
      videoUrl,
      index,
      currentTime
    };
    this.af.database.ref('/watchingResume').child(user.uid).child(animeTitle).set(data);
  }

  readWatchingResume(user: User) {
    const an = this.af.list<WatchingResume>('/watchingResume/' + user.uid);
    return an.snapshotChanges();
  }

  getAnimeDetails(realTitle: string) {
    const an = this.af.object<Anime>('/anime/' + realTitle);
    return an.snapshotChanges();
  }

  deleteWatchingResume(userId: string, animeTitle: string) {
    return this.af.database.ref('/watchingResume').child(userId).child(animeTitle).remove();
  }

  editAnime(anime: Anime) {
    return this.af.database.ref('/anime').child(anime.realTitle).set(anime);
  }

}
