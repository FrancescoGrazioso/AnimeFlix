import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/come.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatBadgeModule, MatDialogModule, MatFormFieldModule, MatIconModule} from '@angular/material';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import { SliderComponent } from './components/slider/slider.component';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from '../environments/environment';
import { AngularFireDatabaseModule} from '@angular/fire/database';
import { AnimeDetailsDialogComponent } from './components/anime-details-dialog/anime-details-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SliderComponent,
    AnimeDetailsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatBadgeModule,
    SlickCarouselModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AnimeDetailsDialogComponent]
})
export class AppModule { }
