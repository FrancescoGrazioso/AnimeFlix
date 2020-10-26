import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  videoUrl: string[];
  currentEpisode: string;
  index: number;
  nextEpisode: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const jsonURL = atob(this.route.snapshot.paramMap.get('videoID'));
    this.videoUrl = JSON.parse(jsonURL);
    this.index = +this.route.snapshot.paramMap.get('numberEpisode');
    this.currentEpisode = this.videoUrl[this.index];
    this.nextEpisode = this.videoUrl.length > this.index + 1 ? this.videoUrl[this.index + 1] : '';
  }

  ngOnInit() {
  }

  goToNextEpisode() {
    const urlToSend = btoa(JSON.stringify(this.videoUrl));
    localStorage.setItem('goHome', 'False');
    this.router.navigate(['loadPlayer', {videoID: urlToSend, numberEpisode: this.index + 1}]);
  }

  encode(stringa: string[]) {
    return btoa(JSON.stringify(stringa));
  }

}
