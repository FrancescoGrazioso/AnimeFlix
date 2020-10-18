import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {Anime} from '../../models/animes';
import {Subscription} from 'rxjs';
import {AnimeService} from '../../services/anime.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-anime-details-dialog',
  templateUrl: './anime-details-dialog.component.html',
  styleUrls: ['./anime-details-dialog.component.scss']
})
export class AnimeDetailsDialogComponent implements OnInit, OnDestroy {

  anime: Anime;
  title: string;
  headerImage: string;
  subs: Subscription[] = [];
  episodesList: string[] = [];
  populated = false;

  constructor(
    private dialogRef: MatDialogRef<AnimeDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private animeService: AnimeService,
    private router: Router) {
    this.anime = data.animeSelected;
    this.title = data.animeSelected.realTitle.match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
    this.headerImage = data.animeSelected.results[0].image_url;
  }

  ngOnInit() {
    this.subs.push(this.animeService.populateAnimeEpisodes(this.anime.key, this.anime.realTitle).subscribe(
      t => {
        let htmlPage = t;
        htmlPage = htmlPage.slice(htmlPage.indexOf('<li>'), htmlPage.indexOf('</ul>'));
        const tmpList = htmlPage.split('<li>');
        tmpList.reverse().pop();
        tmpList.reverse();
        for (let link of tmpList) {
          link = link.slice(link.indexOf('/http') + 1, link.indexOf(' target') - 1);
          this.episodesList.push(link);
        }
        this.populated = true;
      }
    ));
  }

  ngOnDestroy() {
    this.subs.map(s => s.unsubscribe());
  }

  save() {
  }

  close() {
    this.dialogRef.close();
  }

  playEpisode(index: number) {
    const urlToSend = btoa(this.episodesList[index]);
    this.router.navigate(['player', {videoID: urlToSend}]);
    this.close();
  }

}
