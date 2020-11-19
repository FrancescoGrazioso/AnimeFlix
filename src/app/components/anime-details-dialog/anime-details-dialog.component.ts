import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {Anime, Animes} from '../../models/animes';
import {Subscription} from 'rxjs';
import {AnimeService} from '../../services/anime.service';
import {Router} from '@angular/router';
import {StarRatingComponent} from 'ng-starrating';

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
  errorMessage: string;
  isHorizzontal: boolean;

  constructor(
    private dialogRef: MatDialogRef<AnimeDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private animeService: AnimeService,
    private router: Router) {
    this.anime = data.animeSelected;
    this.title = data.animeSelected.results[0].title;
    this.headerImage = data.animeSelected.results[0].image_url;
    this.setHorizzontal();
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
      },
      error => {
        console.log(error.status);
        this.errorMessage = 'Per motivi di copyright non possiamo riprodurre gli episodi di ' + this.title;
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
    const urlToSend = btoa(JSON.stringify(this.episodesList));
    const animeTitle = btoa(this.anime.realTitle);
    this.animeService.updateAnimeViewCounter(this.anime, this.anime.views ? this.anime.views + 1 : 1).then(
      () => {
        this.router.navigate(['player', {videoID: urlToSend, numberEpisode: index, title: animeTitle}]);
        this.close();
      }
    );
  }

  setHorizzontal() {
    if (window.innerWidth > window.innerHeight) { /* orizzontale */
      this.isHorizzontal = true;
    } else { /* verticale */
      this.isHorizzontal = false;
    }
  }

  @HostListener('window:resize')
  // tslint:disable-next-line:typedef
  handleResize() {
    this.setHorizzontal();
  }

  onRate($event: {oldValue: number, newValue: number, starRating: StarRatingComponent}) {
    const currentRating = this.anime.rating && this.anime.rating.review ? this.anime.rating.review : 3;
    const numberOfRatings = this.anime.rating && this.anime.rating.numberOfRating ? this.anime.rating.numberOfRating + 1 : 2;
    const newRating = (+(currentRating) + +$event.newValue);
    this.anime.rating = {
      review: newRating,
      numberOfRating: numberOfRatings
    };
    this.animeService.updateAnimeRating(this.anime)
      .then(
      () => {
        const jsonAnimeList = localStorage.getItem('animeList');
        const allAnime: Animes = JSON.parse(jsonAnimeList);
        for (let i = 0; i < allAnime.results.length; i++) {
          const current = allAnime.results[i];
          if (current.realTitle === this.anime.realTitle) {
            allAnime.results[i] = this.anime;
            localStorage.setItem('animeList', JSON.stringify(allAnime));
          }
        }
      }
    );
  }

}
