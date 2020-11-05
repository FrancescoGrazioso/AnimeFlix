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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {VgCoreModule} from 'videogular2/compiled/src/core/core';
import {VgControlsModule} from 'videogular2/compiled/src/controls/controls';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import {VgOverlayPlayModule} from 'videogular2/compiled/src/overlay-play/overlay-play';
import { LoaderComponent } from './components/loader/loader.component';
import { SearchComponent } from './components/search/search.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import { LoadPlayerComponent } from './components/load-player/load-player.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserComponent } from './components/user/user.component';
import {AuthService} from './services/auth.service';
import {AnimeService} from './services/anime.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { AdminPanelComponent } from './compontents/admin-panel/admin-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SliderComponent,
    AnimeDetailsDialogComponent,
    VideoPlayerComponent,
    LoaderComponent,
    SearchComponent,
    LoadPlayerComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    AdminPanelComponent
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
    AngularFireAuthModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, AnimeService],
  bootstrap: [AppComponent],
  entryComponents: [AnimeDetailsDialogComponent]
})
export class AppModule { }
