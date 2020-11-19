import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {AnimeService} from '../../services/anime.service';
import {Anime, Animes} from '../../models/animes';
import {WatchingResume} from '../../models/watchingResume';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  user: User;
  sticky = false;
  subs: Subscription[] = [];
  watchingResume: WatchingResume[] = [];
  homeScreenMatrix: Animes[] = [];
  tmpAnimes: Animes = {results : []};
  isAdmin = false;
  showAdmin = false;


  constructor(
    private authService: AuthService,
    private animeService: AnimeService,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
    /*this.setSliderWidth();*/
    this.readUserWatchingResume();
    this.subs.push(this.authService.isAdmin().subscribe(
      (data) => {
        for (const admin of data) {
          if (this.user.email === admin.payload.val()) {
            this.isAdmin = true;
            break;
          }
        }
      }
    ));
  }

  ngOnInit() {
  }

  readUserWatchingResume() {
    this.animeService.readWatchingResume(this.user).toPromise().then(
      (data) => {
        this.homeScreenMatrix = [];
        this.tmpAnimes = {results : []};
        this.watchingResume = [];
        // tslint:disable-next-line:forin
        for (const key in data.data()) {
          const currentAnime = data.data()[key];
          const wr: WatchingResume = new WatchingResume(currentAnime);
          this.watchingResume.push(wr);
        }

        for (const res of this.watchingResume) {
          this.subs.push(
            this.animeService.getAnimeDetails(res.animeTitle).subscribe(
              (datas) => {
                const anime: Anime = new Anime(datas.data());
                if (this.watchingResume.length >= 20) {
                  if (this.tmpAnimes.results.length < 20 ) {
                    this.tmpAnimes.results.push(anime);
                  } else {
                    this.homeScreenMatrix.push(this.tmpAnimes);
                    this.tmpAnimes = { results: [] };
                  }
                } else {
                  this.tmpAnimes.results.push(anime);
                  this.homeScreenMatrix = [{results : []}];
                }
              }
            )
          );
        }
      }
    );
  }

  onOpenAnime(anime: Anime) {
    this.watchingResume.map((res) => {
      if (res.animeTitle === anime.realTitle) {
        const urlToSend = btoa(res.videoUrl);
        const animeTitle = btoa(res.animeTitle);
        this.router.navigate(['player', {videoID: urlToSend, numberEpisode: res.index, title: animeTitle, currentTime: res.currentTime}]);
      }
    });
  }

  onDeleteAnime(anime: Anime) {
    this.animeService.deleteWatchingResume(this.user.uid, anime.realTitle).then(
      () => {
        this.homeScreenMatrix = [];
        this.tmpAnimes = {results : []};
        this.readUserWatchingResume();
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

  logout() {
    this.authService.SignOut();
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

}
