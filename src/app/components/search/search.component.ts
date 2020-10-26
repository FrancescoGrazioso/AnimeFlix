import { Component, OnInit } from '@angular/core';
import {Anime, Animes} from '../../models/animes';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AnimeDetailsDialogComponent} from '../anime-details-dialog/anime-details-dialog.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  term: string;

  filterData: Anime[] = [];

  constructor(
    private dialog: MatDialog
  ) {
    const jsonAnimeList = localStorage.getItem('animeList');
    if (jsonAnimeList) {
      const tmpAnimeList: Animes = JSON.parse(jsonAnimeList);
      this.filterData = tmpAnimeList.results;
    }
  }

  ngOnInit() {
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

  cleanTitle(realTitle: string) {
    return realTitle.match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
  }

}
