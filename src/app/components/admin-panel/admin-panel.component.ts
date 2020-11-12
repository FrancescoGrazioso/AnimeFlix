import { Component, OnInit } from '@angular/core';
import {mainURL} from '../../../environments/environment';
import {Subscription} from 'rxjs';
import {AnimeService} from '../../services/anime.service';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  subs: Subscription[] = [];
  titleList: string[] = [];

  constructor(
    private anime: AnimeService,
    private  af: AngularFireDatabase
  ) { }

  ngOnInit() {
  }

  readFromNewSource() {
    // tslint:disable-next-line:forin
    for (const key in mainURL) {
      this.subs.push(this.anime.populateAnimeList(key).subscribe(
        t => {
          let htmlPage = t;
          htmlPage = htmlPage.slice(htmlPage.indexOf('<li>'), htmlPage.indexOf('</ul>'));
          const tmpList = htmlPage.split('<li>');
          tmpList.pop();
          for (let link of tmpList) {
            link = link.slice(link.indexOf('\'>') + 2, link.indexOf('</a'));
            this.titleList.push(link);
          }
          let i = 0;
          for (const link of this.titleList) {
            if (i > 10) {break;}
            if (link && (link.indexOf('.') === -1)) {
              this.af.database.ref('/anime').child(link).once('value', snap => {
                if (!snap.exists()) {
                  i++;
                  let tmpLink = link;
                  if (this.isCharDigit(link.charAt(link.length - 1))) {
                    tmpLink = tmpLink.slice(0, -1);
                  }
                  const titolo = tmpLink.match(/[A-Z][a-z]+|[0-9]+/g);
                  if (titolo) {
                    this.subs.push(this.anime.getAnimeInfo(titolo.join('+')).subscribe(
                      data => {
                        data.key = key;
                        data.realTitle = link;
                        this.af.database.ref('/anime').child(link).set(data);
                        console.log('added ' + link);
                      },
                      error => {}
                    ));
                  }
                }
              });
            }
          }
        }
      ));
    }
  }

  isCharDigit(n) {
    return !!n.trim() && n * 0 === 0;
  }

}
