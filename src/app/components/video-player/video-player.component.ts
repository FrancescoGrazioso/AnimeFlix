import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  videoUrl: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.videoUrl = atob(this.route.snapshot.paramMap.get('videoID'));
  }

}
