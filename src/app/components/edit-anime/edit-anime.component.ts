import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Anime, Animes} from '../../models/animes';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AnimeService} from '../../services/anime.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-anime',
  templateUrl: './edit-anime.component.html',
  styleUrls: ['./edit-anime.component.css']
})
export class EditAnimeComponent implements OnInit, OnDestroy {

  anime: Anime;
  title: string;
  headerImage: string;
  subs: Subscription[] = [];
  sinossi: string;
  allAnime: Animes;

  constructor(
    private dialogRef: MatDialogRef<EditAnimeComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private animeService: AnimeService,
    private router: Router) {
    this.anime = data.animeSelected;
    this.allAnime = data.allAnimeList;
    this.title = data.animeSelected.results[0].title;
    this.headerImage = data.animeSelected.results[0].image_url;
    this.sinossi = this.anime.results[0].synopsis;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subs.map(s => s.unsubscribe());
  }

  save() {
    this.anime.results[0].synopsis = this.sinossi;

    this.animeService.editAnime(this.anime)
      .then(
        () => {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.allAnime.results.length; i++) {
            const current = this.allAnime.results[i];
            if (current.realTitle === this.anime.realTitle) {
              this.allAnime.results[i] = this.anime;
              localStorage.setItem('animeList', JSON.stringify(this.allAnime));
            }
          }
        }
      )
      .catch(
        (e) => {
          console.log(e);
          alert('Erroe nel salvataggio dati, contattare il programmatore');
        }
      );
    close();
  }

  close() {
    this.dialogRef.close();
  }



}
