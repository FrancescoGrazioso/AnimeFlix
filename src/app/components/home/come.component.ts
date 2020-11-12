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

  headerBGUrl: string;
  headerTitle: string;


  constructor(private anime: AnimeService,
              private  af: AngularFireDatabase,
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
  }

  ngOnInit(): void {
    this.loading = true;
    const jsonAnimeList = localStorage.getItem('animeList');
    if (jsonAnimeList) {
      const tmpAnimeList: Animes = JSON.parse(jsonAnimeList);
      let tmpAnimes: Animes = { results: [] };
      for (const currentAnime of tmpAnimeList.results) {
        if (!this.headerBGUrl) { this.headerBGUrl = currentAnime.results[0].image_url; }
        if (!this.headerTitle) { this.headerTitle = currentAnime.realTitle; }

        if (tmpAnimes.results.length < 30 ) {
          tmpAnimes.results.push(currentAnime);
        } else {
          this.homeScreenMatrix.push(tmpAnimes);
          tmpAnimes = { results: [] };
        }
      }
      this.loading = false;
    } else {
      this.uploadNewAnime();
    }
  }

  uploadNewAnime() {
    const an = this.af.list<Anime>('/anime');
    this.subs.push(an.snapshotChanges().subscribe(
      datas => {
        let tmpAnimes: Animes = { results: [] };
        const  allAnimes: Animes = { results: []};
        for (const currentAnime of datas) {
          if (!this.headerBGUrl) { this.headerBGUrl = currentAnime.payload.val().results[0].image_url; }
          if (!this.headerTitle) { this.headerTitle = currentAnime.payload.val().realTitle; }

          if (tmpAnimes.results.length < 30 ) {
            tmpAnimes.results.push(currentAnime.payload.val());
          } else {
            this.homeScreenMatrix.push(tmpAnimes);
            tmpAnimes = { results: [] };
          }
          allAnimes.results.push(currentAnime.payload.val());
        }
        this.loading = false;
        localStorage.setItem('animeList', JSON.stringify(allAnimes));
      }
    ));
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
