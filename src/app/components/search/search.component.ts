import {Component, OnDestroy, OnInit} from '@angular/core';
import {Anime, Animes} from '../../models/animes';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AnimeDetailsDialogComponent} from '../anime-details-dialog/anime-details-dialog.component';
import {EditAnimeComponent} from '../edit-anime/edit-anime.component';
import {User} from '../../models/user';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  term: string;
  user: User;
  isAdmin = false;
  subs: Subscription[] = [];

  filterData: Anime[] = [];
  allAnime: Animes;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    const jsonAnimeList = localStorage.getItem('allAnimeList');
    this.user = JSON.parse(localStorage.getItem('user'));
    if (jsonAnimeList) {
      const tmpAnimeList: Animes = JSON.parse(jsonAnimeList);
      this.filterData = tmpAnimeList.results;
      this.allAnime = tmpAnimeList;
    }
    if (this.user) {
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

  openEditDialog(anime: Anime) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.panelClass = 'my-panel';
    dialogConfig.width = '90%';

    dialogConfig.data = {
      animeSelected: anime,
      allAnimeList: this.allAnime
    };

    this.dialog.open(EditAnimeComponent, dialogConfig);
  }

  cleanTitle(realTitle: string) {
    return realTitle.match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
  }

  ngOnDestroy(): void {
    this.subs.map( s => s.unsubscribe() );
  }

}
