import { Component } from '@angular/core';
import {Anime, Animes} from './models/animes';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AnimeFlix';

  constructor(private  af: AngularFireDatabase,
              private firestore: AngularFirestore) {
    this.populateHomeList();
    this.populateSearchList();
  }


  populateHomeList() {
    // tslint:disable-next-line:no-shadowed-variable
    const ref = this.firestore.collection<Anime>('anime', ref => ref.orderBy('views').limitToLast(25));
    ref.get().toPromise().then(
      (data) => {
        const  allAnimes = { results: []};
        data.forEach((obj => {
          const docData = obj.data();
          const currentAnime = docData;
          allAnimes.results.push(currentAnime);
        }));
        localStorage.setItem('animeList', JSON.stringify(allAnimes));
      }
    );
  }

  populateSearchList() {
    const ref = this.af.database.ref('anime');
    ref.on('value', (data) => {
      const  allAnimes: Animes = { results: []};
      data.forEach(obj => {
        const currentAnime: Anime = obj.val();
        allAnimes.results.push(currentAnime);
      });
      localStorage.setItem('allAnimeList', JSON.stringify(allAnimes));
    });
  }
}
