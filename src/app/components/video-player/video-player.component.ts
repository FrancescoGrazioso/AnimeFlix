import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {VgAPI} from 'videogular2/compiled/src/core/services/vg-api';
import {AnimeService} from '../../services/anime.service';
import {Subscription} from 'rxjs';
import {User} from '../../models/user';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  videoUrl: string[];
  currentEpisode: string;
  index: number;
  nextEpisode: string;
  subs: Subscription[] = [];
  user: User;
  prevCurrentTime = 0;
  animeTitle: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: VgAPI,
    private animeService: AnimeService
  ) {
    const jsonURL = atob(this.route.snapshot.paramMap.get('videoID'));
    this.videoUrl = JSON.parse(jsonURL);
    this.index = +this.route.snapshot.paramMap.get('numberEpisode');
    this.currentEpisode = this.videoUrl[this.index];
    this.nextEpisode = this.videoUrl.length > this.index + 1 ? this.videoUrl[this.index + 1] : '';

    const userCurrentTime = +this.route.snapshot.paramMap.get('currentTime');
    if (userCurrentTime) {
      this.prevCurrentTime = userCurrentTime;
    }
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  goToNextEpisode() {
    const urlToSend = btoa(JSON.stringify(this.videoUrl));
    localStorage.setItem('goHome', 'False');
    this.prevCurrentTime = 0;
    this.router.navigate(['loadPlayer', {videoID: urlToSend, numberEpisode: this.index + 1, title: btoa(this.animeTitle)}]);
  }

  encode(stringa: string[]) {
    return btoa(JSON.stringify(stringa));
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
    this.animeTitle = atob(this.route.snapshot.paramMap.get('title'));
    this.api.getDefaultMedia().currentTime = this.prevCurrentTime;

    if (this.user && !this.user.isAnonymous) {
      this.subs.push(this.api.getDefaultMedia().subscriptions.progress.subscribe(
        () => {
          if (this.api.getDefaultMedia().currentTime - this.prevCurrentTime > 10) {
            this.animeService.uploadEpisodeStatus(
              this.user,
              this.animeTitle,
              JSON.stringify(this.videoUrl),
              this.index,
              this.api.getDefaultMedia().currentTime);

            this.prevCurrentTime = this.api.getDefaultMedia().currentTime;
          }
        }
      ));
    }
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

}
