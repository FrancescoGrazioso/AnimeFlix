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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  sticky = false;
  subs: Subscription[] = [];
  loading = false;

  homeScreenMatrix: Animes[] = [];

  sliderConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false
  };

  headerBGUrl: string;
  headerTitle: string;
  titleList: string[] = [];

  constructor(private anime: AnimeService,
              private  af: AngularFireDatabase,
              private http: HttpClient,
              private dialog: MatDialog) {
    const windowsWidth = window.innerWidth;
    let slidesToShow = 0;
    if (windowsWidth < 400) {
      slidesToShow = 1;
    } else if (windowsWidth < 800) {
      slidesToShow = 2;
    } else if (windowsWidth < 1100) {
      slidesToShow = 3;
    } else if (windowsWidth < 1400) {
      slidesToShow = 4;
    } else if (windowsWidth < 1700) {
      slidesToShow = 5;
    } else if (windowsWidth < 2000) {
      slidesToShow = 6;
    } else if (windowsWidth < 2400) {
      slidesToShow = 7;
    }  else if (windowsWidth < 3000) {
      slidesToShow = 8;
    }  else if (windowsWidth < 3500) {
      slidesToShow = 9;
    }  else if (windowsWidth < 4000) {
      slidesToShow = 10;
    } else {
      slidesToShow = 11;
    }

    this.sliderConfig.slidesToShow = slidesToShow;
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

        if (tmpAnimes.results.length < 20 ) {
          tmpAnimes.results.push(currentAnime);
        } else {
          this.homeScreenMatrix.push(tmpAnimes);
          tmpAnimes = { results: [] };
        }
      }
      this.loading = false;
      this.loading = false;
    } else {
    // tslint:disable-next-line:forin
      for (const key in mainURL) {
        this.subs.push(this.anime.populateAnimeList(key).subscribe(
          t => {
            let htmlPage = t;
            htmlPage = htmlPage.slice(htmlPage.indexOf('<li>'), htmlPage.indexOf('</ul>'));
            const tmpList = htmlPage.split('<li>');
            tmpList.pop();
            for (let link of tmpList) {
              link = link.slice(link.indexOf('\'>') + 2, link.indexOf('</a'));
              this.titleList.push(link);
            }
            for (const link of this.titleList) {
              if (link) {
                this.af.database.ref('/anime').child(link).once('value', snap => {
                  if (!snap.exists()) {
                    let tmpLink = link;
                    if (this.isCharDigit(link.charAt(link.length - 1))) {
                      tmpLink = tmpLink.slice(0, -1);
                    }
                    const titolo = tmpLink.match(/[A-Z][a-z]+|[0-9]+/g);
                    if (titolo) {
                      this.subs.push(this.anime.getAnimeInfo(titolo.join('+')).subscribe(
                        data => {
                          data.key = key;
                          data.realTitle = link;
                          this.af.database.ref('/anime').child(link).set(data);
                          console.log('added ' + link);
                        }
                      ));
                    }
                  }
                });
              }
            }
          }
        ));
      }
      const an = this.af.list<Anime>('/anime');
      this.subs.push(an.snapshotChanges().subscribe(
        datas => {
          let tmpAnimes: Animes = { results: [] };
          const  allAnimes: Animes = { results: []};
          for (const currentAnime of datas) {
            if (!this.headerBGUrl) { this.headerBGUrl = currentAnime.payload.val().results[0].image_url; }
            if (!this.headerTitle) { this.headerTitle = currentAnime.payload.val().realTitle; }

            if (tmpAnimes.results.length < 20 ) {
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

  @HostListener('window:scroll', ['$event'])
  // tslint:disable-next-line:typedef
  handleScroll() {
    const windowScroll = window.pageYOffset;

    if (windowScroll >= document.getElementById('stickyHeader').offsetHeight) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

   isCharDigit(n) {
    return !!n.trim() && n * 0 === 0;
  }


}
