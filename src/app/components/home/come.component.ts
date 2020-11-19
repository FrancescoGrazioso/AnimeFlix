import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Anime, Animes} from '../../models/animes';
import {Subscription} from 'rxjs';
import {AnimeService} from '../../services/anime.service';
import {mainURL} from '../../../environments/environment';
import {AngularFireDatabase} from '@angular/fire/database';
import {HttpClient} from '@angular/common/http';
import {delay} from 'rxjs/operators';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AnimeDetailsDialogComponent} from '../anime-details-dialog/anime-details-dialog.component';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import {Banner} from '../../models/banner';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  sticky = false;
  subs: Subscription[] = [];
  loading = false;
  user: User;
  banner: Banner;

  homeScreenMatrix: Animes[] = [];


  constructor(private anime: AnimeService,
              private  af: AngularFireDatabase,
              private firestore: AngularFirestore,
              private http: HttpClient,
              private auth: AuthService,
              private dialog: MatDialog) {
    this.user = JSON.parse(localStorage.getItem('user'));
    /*this.banner = {
      adClient: 'ca-pub-YOURID',
      adSlot: YOURSLOT,
      adFormat: 'auto',
      fullWidthResponsive: true
    };*/
    this.banner = {
      adClient: 'ca-pub-1699180465186643',
      adSlot: 2439043079,
      adFormat: 'auto',
      fullWidthResponsive: true
    };
  }

  ngOnInit(): void {
    this.loading = true;
    const jsonAnimeList = localStorage.getItem('animeList');
    if (jsonAnimeList) {
      const tmpAnimeList: Animes = JSON.parse(jsonAnimeList);
      let tmpAnimes: Animes = { results: [] };
      tmpAnimeList.results = tmpAnimeList.results.reverse();
      for (const currentAnime of tmpAnimeList.results) {

        if (tmpAnimes.results.length < 20 ) {
          tmpAnimes.results.push(currentAnime);
        } else {
          this.homeScreenMatrix.push(tmpAnimes);
          tmpAnimes = { results: [] };
        }
      }
      this.loading = false;
    } else {
      this.populateHomeList();
    }
  }

  openDialog(anime: Anime) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.panelClass = 'my-panel';
    dialogConfig.width = '90%';

    dialogConfig.data = {
      animeSelected: anime
    };

    this.dialog.open(AnimeDetailsDialogComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  populateHomeList() {
    // tslint:disable-next-line:no-shadowed-variable
    const ref = this.firestore.collection<Anime>('anime', ref => ref.orderBy('views').limitToLast(21));
    return ref.get().toPromise().then(
      (data) => {
        const  allAnimes = { results: []};
        data.forEach((obj => {
          const docData = obj.data();
          const currentAnime = docData;
          allAnimes.results.push(currentAnime);
        }));
        localStorage.setItem('animeList', JSON.stringify(allAnimes));
        const jsonAnimeList = localStorage.getItem('animeList');
        if (jsonAnimeList) {
          const tmpAnimeList: Animes = JSON.parse(jsonAnimeList);
          let tmpAnimes: Animes = { results: [] };
          tmpAnimeList.results = tmpAnimeList.results.reverse();
          for (const currentAnime of tmpAnimeList.results) {

            if (tmpAnimes.results.length < 20 ) {
              tmpAnimes.results.push(currentAnime);
            } else {
              this.homeScreenMatrix.push(tmpAnimes);
              tmpAnimes = { results: [] };
            }
          }
          this.loading = false;
        }
      }
    );
  }

  @HostListener('window:scroll')
  // tslint:disable-next-line:typedef
  handleScroll() {
    const windowScroll = window.pageYOffset;

    if (windowScroll >= document.getElementById('stickyHeader').offsetHeight) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

}
