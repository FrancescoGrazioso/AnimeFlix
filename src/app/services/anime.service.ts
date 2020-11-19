import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { mainURL} from 'src/environments/environment';
import {Anime, Animes} from '../models/animes';
import {User} from '../models/user';
import {AngularFireDatabase} from '@angular/fire/database';
import {WatchingResume} from '../models/watchingResume';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;


@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private mainURLS = mainURL;

  constructor(private http: HttpClient,
              private  af: AngularFireDatabase,
              private firestore: AngularFirestore) {
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
    const wr: WatchingResume = {
      uid: user.uid,
      animeTitle,
      videoUrl,
      index,
      currentTime
    };
    const data = {[animeTitle]: wr};
    this.firestore.collection('watchingResume').doc(user.uid).get().toPromise().then(
      (doc) => {
        if (doc.exists) {
          this.firestore.collection('watchingResume').doc(user.uid).update(data);
        } else {
          this.firestore.collection('watchingResume').doc(user.uid).set(data);
        }
      }
    );
  }

  readWatchingResume(user: User) {
    return this.firestore.collection('watchingResume').doc(user.uid).get();
  }

  getAnimeDetails(realTitle: string) {
    const an = this.firestore.collection('anime').doc<Anime>(realTitle).get();
    return an;
  }

  deleteWatchingResume(userId: string, animeTitle: string) {
    return this.firestore.collection('watchingResume').doc(userId).update(
      {[animeTitle]: FieldValue.delete()}
    );
  }

  editAnimeSynopsis(anime: Anime) {
    return this.firestore.collection('anime').doc(anime.realTitle).update({
      results: [{synopsis: anime.results[0].synopsis}]
    });
  }

  updateAnimeViewCounter(anime: Anime, newViewCounter: number) {
    return this.firestore.collection('anime').doc(anime.realTitle).update({views: newViewCounter});
  }

  updateAnimeRating(anime: Anime) {
    return this.firestore.collection('anime').doc(anime.realTitle).update({
      rating: anime.rating
    });
  }
}
