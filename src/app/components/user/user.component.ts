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
  sliderConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false
  };


  constructor(
    private authService: AuthService,
    private animeService: AnimeService,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.setSliderWidth();
    this.readUserWatchingResume();
  }

  ngOnInit() {
  }

  getUserPic() {
    return this.user && this.user.photoURL ? this.user.photoURL : 'assets/images/poster_placeholder.jpg';
  }

  readUserWatchingResume() {
    this.subs.push(
      this.animeService.readWatchingResume(this.user).subscribe(
        (data) => {

          this.homeScreenMatrix = [];
          this.tmpAnimes = {results : []};
          this.watchingResume = [];

          for (const currentAnime of data) {
            const anime: WatchingResume = currentAnime.payload.val();
            this.watchingResume.push(anime);
          }

          for (const res of this.watchingResume) {
            this.subs.push(
              this.animeService.getAnimeDetails(res.animeTitle).subscribe(
                (datas) => {
                  const anime: Anime = datas.payload.val();
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
      )
    );
  }

  setSliderWidth() {
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
        /*this.homeScreenMatrix = [];
        this.tmpAnimes = {results : []};
        this.readUserWatchingResume();*/
      }
    );
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

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

}
