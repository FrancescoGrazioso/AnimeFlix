import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-load-player',
  templateUrl: './load-player.component.html',
  styleUrls: ['./load-player.component.css']
})
export class LoadPlayerComponent implements OnInit {
  videoUrl: string[];
  currentEpisode: string;
  index: number;
  nextEpisode: string;
  title: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const jsonURL = atob(this.route.snapshot.paramMap.get('videoID'));
    this.videoUrl = JSON.parse(jsonURL);
    this.index = +this.route.snapshot.paramMap.get('numberEpisode');
    this.title = route.snapshot.paramMap.get('title');
    this.currentEpisode = this.videoUrl[this.index];
    this.nextEpisode = this.videoUrl.length > this.index + 1 ? this.videoUrl[this.index + 1] : '';
  }

  ngOnInit() {
    const goHome = localStorage.getItem('goHome');
    if (goHome === 'False') {
      const urlToSend = btoa(JSON.stringify(this.videoUrl));
      this.router.navigate(['player', {videoID: urlToSend, numberEpisode: this.index, title: this.title}]);
      localStorage.setItem('goHome', 'True');
    } else {
      this.router.navigate(['']);
    }
  }

}
